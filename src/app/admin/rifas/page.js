import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import RifasList from "@/components/admin/RifasList";

export default async function RifasAdminPage() {
  const supabase = await createClient();

  const { data: rifas, error } = await supabase
    .from("rifas")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white mb-1">Rifas</h1>
          <p className="text-zinc-500">
            Administra tus sorteos activos e históricos.
          </p>
        </div>
        <Link
          href="/admin/rifas/nueva"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap inline-flex items-center gap-2 shrink-0 h-fit"
        >
          + Nueva Rifa
        </Link>
      </header>

      <RifasList initialRifas={rifas || []} />
    </div>
  );
}
