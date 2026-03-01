import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const {
      rifa_id,
      nombre,
      cedula,
      telefono,
      correo,
      cantidad,
      metodo_pago,
      referencia_pago,
      comprobante_url,
      folio: folioFrontend,
    } = body;

    // 0. Consultar datos de la rifa
    const { data: rifa, error: errorRifa } = await supabase
      .from("rifas")
      .select("*")
      .eq("id", rifa_id)
      .single();

    if (errorRifa || !rifa) throw new Error("Rifa no encontrada");

    // 1. Consultar números ya usados
    const { data: usados, error: errorFetch } = await supabase
      .from("boletos")
      .select("numero_boleto")
      .eq("rifa_id", rifa_id)
      .in("estado", ["pendiente", "pagado"]);

    const numerosUsados = usados
      ? usados.flatMap((b) =>
          b.numero_boleto.split(",").map((n) => parseInt(n.trim())),
        )
      : [];

    // 2. Lógica de disponibilidad
    const limiteRifa = rifa.total_boletos || 1000;
    const usadosSet = new Set(numerosUsados);
    const seleccionados = [];

    while (seleccionados.length < cantidad) {
      const numAleatorio = Math.floor(Math.random() * limiteRifa) + 1;
      if (
        !usadosSet.has(numAleatorio) &&
        !seleccionados.includes(numAleatorio)
      ) {
        seleccionados.push(numAleatorio);
      }
      if (usadosSet.size + seleccionados.length >= limiteRifa) break;
    }

    if (seleccionados.length < cantidad) {
      return NextResponse.json(
        { error: "No hay suficientes boletos disponibles" },
        { status: 400 },
      );
    }

    const finalFolio =
      folioFrontend ||
      `RIFA-${new Date().getFullYear()}-${Math.random().toString(36).toUpperCase().substring(2, 6)}`;

    // 3. Insertar con los nuevos campos
    const { data: insertedData, error: errorInsert } = await supabase
      .from("boletos")
      .insert([
        {
          rifa_id,
          numero_boleto: seleccionados.join(", "),
          folio: finalFolio,
          comprador_nombre: nombre,
          comprador_cedula: cedula,
          comprador_telefono: telefono,
          comprador_correo: correo,
          metodo_pago,
          estado: "pendiente",
          monto_pagado: cantidad * rifa.precio_boleto,
          referencia_pago,
          comprobante_url,
        },
      ])
      .select()
      .single();

    if (errorInsert) {
      console.error("Error Supabase Insert:", errorInsert);
      return NextResponse.json({ error: errorInsert.message }, { status: 500 });
    }

    // 4. Actualizar el contador de vendidos
    const nuevosVendidos = (rifa.boletos_vendidos || 0) + cantidad;
    await supabase
      .from("rifas")
      .update({ boletos_vendidos: nuevosVendidos })
      .eq("id", rifa_id);

    // 5. Registrar actividad con metadata detallada
    await supabase.from("actividades").insert([
      {
        tipo: "reserva",
        descripcion: `Nueva reserva: ${nombre} (${cantidad} boletos por ${metodo_pago})`,
        monto: 0,
        metadata: {
          folio: finalFolio,
          comprador: nombre,
          cedula: cedula,
          metodo_pago: metodo_pago,
          rifa_nombre: rifa.nombre,
          cantidad: cantidad,
          boleto_id: insertedData.id,
          referencia: referencia_pago,
        },
      },
    ]);

    revalidatePath(`/rifa/${rifa.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/finanzas");

    return NextResponse.json(
      {
        success: true,
        id: insertedData.id,
        numeros: seleccionados,
        folio: finalFolio,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno del servidor" },
      { status: 500 },
    );
  }
}
