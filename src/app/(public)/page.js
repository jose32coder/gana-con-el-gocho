// app/page.js

import RifaCard from "@/components/RifaCard";
import { createClient } from "@/lib/supabase-server";
import { Clover } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  // Consultamos las rifas activas según el flujo del comprador
  const { data: rifas, error } = await supabase
    .from("rifas")
    .select("*")
    .eq("estado", "activa")
    .order("created_at", { ascending: false });

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Error al cargar las rifas. Por favor, intenta de nuevo.
      </div>
    );

  return (
    // Fondo dinámico para light/dark mode
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-12 text-center pt-8 flex flex-col items-center">
          {/* Contenedor del Icono y el Subtítulo pequeño */}
          <div className="flex flex-col items-center mb-4">
            <Clover
              className="text-emerald-500 fill-emerald-500/20 mb-2"
              size={40} // Un poco más grande para que resalte
              strokeWidth={2.5}
            />
            <span className="text-sm font-bold uppercase text-emerald-500 tracking-widest">
              Sorteos Oficiales
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl md:text-6xl font-black mb-3 text-zinc-900 dark:text-white tracking-tight uppercase">
            Gánate una <span className="text-emerald-500">Rifa</span>
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mx-auto">
            Participa y gana increíbles premios con nosotros
          </p>
        </header>
        {rifas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-zinc-400 dark:text-zinc-600 font-medium">
              No hay rifas activas en este momento.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {rifas.map((rifa, index) => (
              <div
                key={rifa.slug}
                className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-sm"
              >
                <RifaCard rifa={rifa} priority={index < 3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
