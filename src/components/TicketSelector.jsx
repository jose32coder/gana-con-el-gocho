"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function TicketSelector({
  cantidad,
  setCantidad,
  precioUnitario,
}) {
  const [opciones, setOpciones] = useState([0]); // Fallback por si falla
  const total = cantidad * precioUnitario;

  useEffect(() => {
    async function loadOptions() {
      const { data } = await supabase
        .from("configuracion")
        .select("valor")
        .eq("clave", "opciones_tickets")
        .single();
      if (data) setOpciones(data.valor);
    }
    loadOptions();
  }, []);

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-yellow-500">🎫</span> Cantidad de Tickets
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {opciones.map((num) => (
          <button
            key={num}
            onClick={() => setCantidad((prev) => prev + num)}
            className="py-3 rounded-xl font-bold transition-all bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5"
          >
            +{num}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 mb-8">
        <button
          onClick={() => setCantidad((prev) => Math.max(3, prev - 1))}
          className="w-12 h-12 rounded-full border-2 border-red-500/50 text-red-500 text-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={cantidad <= 3}
        >
          {" "}
          −{" "}
        </button>
        <span className="text-6xl font-black tabular-nums">{cantidad}</span>
        <button
          onClick={() => setCantidad((prev) => prev + 1)}
          className="w-12 h-12 rounded-full border-2 border-emerald-500/50 text-emerald-500 text-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
        >
          {" "}
          +{" "}
        </button>
      </div>

      <div className="border-t border-zinc-800 pt-6 flex justify-between items-end">
        <p className="text-zinc-500 font-medium">Monto Total</p>
        <p className="text-4xl font-black text-emerald-500">
          {total.toLocaleString()}
          <span className="text-sm text-zinc-400 ml-2">BS</span>
        </p>
      </div>
    </section>
  );
}
