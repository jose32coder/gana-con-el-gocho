import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const { count: totalRifas } = await supabase
    .from("rifas")
    .select("*", { count: "exact", head: true });
  const { count: activeRifas } = await supabase
    .from("rifas")
    .select("*", { count: "exact", head: true })
    .eq("estado", "activa");

  const { data: boletos } = await supabase
    .from("boletos")
    .select("estado, monto_pagado");

  const totalPagado =
    boletos
      ?.filter((b) => b.estado === "pagado")
      .reduce((acc, curr) => acc + (curr.monto_pagado || 0), 0) || 0;
  const boletosPendientes =
    boletos?.filter((b) => b.estado === "pendiente").length || 0;

  // Fetch recent activities
  const { data: actividades } = await supabase
    .from("actividades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const stats = [
    {
      name: "Recaudación Total",
      value: `$${totalPagado.toLocaleString()} BS`,
      icon: "💰",
      color: "text-emerald-500",
    },
    {
      name: "Boletos Pendientes",
      value: boletosPendientes,
      icon: "⏳",
      color: "text-orange-500",
    },
    {
      name: "Rifas Activas",
      value: activeRifas,
      icon: "🔥",
      color: "text-blue-500",
    },
    {
      name: "Total de Rifas",
      value: totalRifas,
      icon: "🎟️",
      color: "text-purple-500",
    },
  ];

  const getIcon = (tipo) => {
    switch (tipo) {
      case "reserva":
        return "🎫";
      case "pago":
        return "✅";
      case "vencimiento":
        return "⏰";
      case "ajuste":
        return "⚙️";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-6 md:space-y-10">
      <header className="px-2 md:px-0">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">
          Dashboard
        </h1>
        <p className="text-zinc-500 text-sm md:text-lg font-medium">
          Resumen general de tu sistema de rifas.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl shadow-xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${stat.color} bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800`}
              >
                En vivo
              </span>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
              {stat.name}
            </p>
            <p className="text-2xl md:text-3xl font-black text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-3xl flex flex-col">
          <h3 className="text-xl font-black mb-6 md:mb-10 flex items-center gap-2 uppercase tracking-tighter">
            <span className="text-emerald-500">📈</span> Actividad Reciente
          </h3>

          <div className="flex-1 space-y-4">
            {actividades && actividades.length > 0 ? (
              actividades.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-4 p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl text-xl group-hover:scale-110 transition-transform">
                    {getIcon(act.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {act.descripcion}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">
                      {new Date(act.created_at).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {act.monto > 0 && (
                    <div className="text-right">
                      <p className="text-emerald-500 font-black text-sm">
                        +${act.monto.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 text-zinc-600">
                <span className="text-5xl mb-6 grayscale opacity-20">📦</span>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  No hay actividad registrada aún
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-3xl h-fit">
          <h3 className="text-xl font-black mb-6 md:mb-10 flex items-center gap-2 uppercase tracking-tighter">
            <span className="text-emerald-500">⚡</span> Accesos Rápidos
          </h3>
          <div className="space-y-4">
            <Link
              href="/admin/rifas/nueva"
              className="block w-full text-center bg-white text-zinc-950 font-black py-5 rounded-2xl hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Crear Nueva Rifa
            </Link>
            <Link
              href="/admin/boletos"
              className="block w-full text-center bg-zinc-800 text-white font-black py-5 rounded-2xl hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-700"
            >
              Validar Pagos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
