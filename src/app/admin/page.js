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
  const { data: actividades, error: errorActividades } = await supabase
    .from("actividades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (errorActividades) {
    console.error("Error fetching activities:", errorActividades);
  }

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
      <header className="px-2 md:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-sm md:text-lg font-medium">
            Resumen general de tu sistema de rifas.
          </p>
        </div>
        <div className="hidden md:block pb-2">
          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em]">
            Panel de Control v2.0
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-4xl shadow-xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </span>
              <div className="bg-zinc-950 p-1 rounded-full border border-zinc-800">
                <div
                  className={`w-2 h-2 rounded-full ${stat.color.replace("text", "bg")} animate-pulse`}
                />
              </div>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
              {stat.name}
            </p>
            <p className="text-2xl md:text-3xl font-black text-white italic">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-[2.5rem] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10">
            <h3 className="text-xl md:text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <span className="text-emerald-500 text-2xl">📊</span> Actividad
              Reciente
            </h3>
            <Link
              href="/admin/actividades"
              className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-1 transition-all"
            >
              Ver Bitácora Completa
            </Link>
          </div>

          <div className="flex-1 space-y-4 relative z-10">
            {actividades && actividades.length > 0 ? (
              <>
                <div className="space-y-4">
                  {actividades.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center gap-5 p-5 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all group hover:bg-zinc-900/40"
                    >
                      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-zinc-900 rounded-xl text-2xl group-hover:scale-110 transition-transform border border-zinc-800">
                        {getIcon(act.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors">
                          {act.descripcion}
                        </p>
                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mt-1.5 flex items-center gap-2">
                          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                          {new Date(act.created_at).toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {act.monto > 0 && (
                        <div className="text-right pl-4">
                          <p className="text-emerald-500 font-black text-base italic">
                            +${act.monto.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
                  <Link
                    href="/admin/actividades"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-600 transition-all active:scale-95 group"
                  >
                    Abrir Bitácora Detallada
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                <span className="text-6xl mb-6 grayscale opacity-20">📦</span>
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  No hay actividad registrada aún
                </p>
              </div>
            )}

            {errorActividades && (
              <div className="mt-8 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Error de Sistema
                </p>
                <div className="text-[10px] font-mono text-zinc-600 overflow-x-auto whitespace-pre p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                  {JSON.stringify(errorActividades, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-[2.5rem] h-fit shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <h3 className="text-xl font-black mb-8 md:mb-12 flex items-center gap-3 uppercase tracking-tighter relative z-10">
            <span className="text-emerald-500 text-2xl">⚡</span> Accesos
            Rápidos
          </h3>
          <div className="space-y-4 relative z-10">
            <Link
              href="/admin/rifas/nueva"
              className="group w-full bg-white text-zinc-950 font-black p-6 rounded-3xl hover:bg-emerald-500 transition-all duration-300 active:scale-95 shadow-xl shadow-white/5 flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">
                🎟️
              </span>
              <span className="uppercase text-sm tracking-tighter">
                Crear Nueva Rifa
              </span>
            </Link>
            <Link
              href="/admin/boletos"
              className="group w-full bg-zinc-800 text-white font-black p-6 rounded-3xl hover:bg-zinc-700 transition-all duration-300 active:scale-95 border border-zinc-700 flex flex-col items-center text-center"
            >
              <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">
                💳
              </span>
              <span className="uppercase text-sm tracking-tighter">
                Validar Pagos
              </span>
            </Link>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <Link
                href="/admin/finanzas"
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-[9px] font-black uppercase text-center text-zinc-500 hover:text-white hover:border-emerald-500/30 transition-all"
              >
                Ingresos
              </Link>
              <Link
                href="/admin/ajustes"
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-[9px] font-black uppercase text-center text-zinc-500 hover:text-white hover:border-emerald-500/30 transition-all"
              >
                Configuración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
