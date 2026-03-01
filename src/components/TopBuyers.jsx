"use client";

export default function TopBuyers({ buyers }) {
  if (!buyers || !Array.isArray(buyers) || buyers.length === 0) return null;

  return (
    <div className="premium-card p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl text-white flex items-center gap-2">
          <span className="text-emerald-500">🏆</span> Top Compradores
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
          En Vivo
        </span>
      </div>

      <div className="space-y-4">
        {buyers.map((buyer, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl group hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                  index === 0
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                    : index === 1
                      ? "bg-zinc-500/10 border-zinc-500/50 text-zinc-400"
                      : index === 2
                        ? "bg-orange-500/10 border-orange-500/50 text-orange-500/70"
                        : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500"
                }`}
              >
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wide">
                  {buyer.nombre}
                </p>
                <div className="w-32 h-1 bg-zinc-900 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1000"
                    style={{
                      width: `${Math.min((buyer.tickets / buyers[0].tickets) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-white leading-none">
                {buyer.tickets}
              </p>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                Tickets
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
