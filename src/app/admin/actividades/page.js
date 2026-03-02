import { createClient } from "@/lib/supabase-server";
import ActividadesTable from "@/components/admin/ActividadesTable";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ActividadesAdminPage() {
  const supabase = await createClient();

  const { data: actividades, error } = await supabase
    .from("actividades")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin"
              className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all"
            >
              <ChevronLeft size={20} />
            </Link>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Historial de Sistema
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
            Bitácora
          </h1>
          <p className="text-zinc-500 font-medium">
            Registro detallado de todos los eventos y acciones realizados.
          </p>
        </div>
      </header>

      <div className="bg-zinc-900/30 p-1 rounded-3xl border border-zinc-800/50">
        <ActividadesTable initialData={actividades || []} />
      </div>
    </div>
  );
}
