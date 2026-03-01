import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RifaDetallePage(props) {
  const params = await props.params;
  const slug = params.slug;
  const supabase = await createClient();

  const { data: rifa, error } = await supabase
    .from("rifas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !rifa) {
    return notFound();
  }

  const progreso = (rifa.boletos_vendidos / rifa.total_boletos) * 100;
  const porcentaje = Math.round(progreso);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagen del Premio */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <Image
              src={rifa.imagen_url || "/placeholder-rifa.jpg"}
              alt={rifa.nombre}
              width={600}
              height={600}
              priority
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          {/* Detalles */}
          <div className="space-y-8">
            <header>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  Sorteo Activo
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  Slug: {rifa.slug}
                </span>
              </div>
              <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
                {rifa.nombre}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                {rifa.descripcion}
              </p>
            </header>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Costo por Boleto
                  </p>
                  <p className="text-4xl font-black text-zinc-900 dark:text-white">
                    {rifa.precio_boleto.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-zinc-500">
                      BS
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Disponibles
                  </p>
                  <p className="text-2xl font-black text-emerald-500">
                    {rifa.total_boletos - rifa.boletos_vendidos}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-emerald-500">
                    {porcentaje}% VENDIDO
                  </span>
                  <span className="text-zinc-400">
                    {100 - porcentaje}% RESTANTE
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000"
                    style={{ width: `${Math.min(progreso, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={`/rifa/${rifa.slug}/comprar`}
                  className="block w-full text-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black py-5 rounded-2xl text-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all transform active:scale-[0.98] shadow-xl"
                >
                  Comprar Boletos Ahora
                </Link>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💳</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Pago Seguro
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Entrega Inmediata
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
