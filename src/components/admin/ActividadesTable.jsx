"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  DollarSign,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Settings,
} from "lucide-react";

export default function ActividadesTable({ initialData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const getIcon = (tipo) => {
    switch (tipo) {
      case "reserva":
        return <Ticket size={18} className="text-orange-500" />;
      case "pago":
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      case "vencimiento":
        return <Clock size={18} className="text-red-500" />;
      case "ajuste":
        return <Settings size={18} className="text-blue-500" />;
      default:
        return <Info size={18} className="text-zinc-500" />;
    }
  };

  const filteredData = useMemo(() => {
    return initialData.filter((act) => {
      const searchStr = `${act.descripcion} ${act.tipo}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [initialData, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Header Actions: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar en bitácora..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] hidden sm:block">
            Filas
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-black text-white focus:outline-none cursor-pointer hover:border-zinc-700 transition-colors uppercase tracking-widest"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} por página
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Tipo
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Descripción del Evento
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Monto
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">
                  Fecha / Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {paginatedData.map((act) => (
                <tr
                  key={act.id}
                  className="hover:bg-zinc-800/20 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform shadow-inner">
                      {getIcon(act.tipo)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                      {act.descripcion}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-medium mt-1 font-mono">
                      ID: {act.id}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    {act.monto > 0 ? (
                      <span className="text-emerald-500 font-black text-base italic tabular-nums">
                        +${act.monto.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-zinc-700 font-bold text-xs italic opacity-30">
                        ---
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-zinc-300 text-xs font-black uppercase tracking-tighter">
                      {new Date(act.created_at).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-black mt-1 uppercase">
                      {new Date(act.created_at).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card List */}
        <div className="lg:hidden divide-y divide-zinc-800/50">
          {paginatedData.map((act) => (
            <div
              key={act.id}
              className="p-6 flex gap-4 active:bg-zinc-800/50 transition-colors"
            >
              <div className="w-12 h-12 shrink-0 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-xl">
                {getIcon(act.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="text-[13px] font-black text-white uppercase leading-tight line-clamp-2">
                    {act.descripcion}
                  </p>
                  {act.monto > 0 && (
                    <span className="text-emerald-500 font-black text-sm italic shrink-0 tabular-nums">
                      +${act.monto.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                    {new Date(act.created_at).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                  <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                    {new Date(act.created_at).toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {paginatedData.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-xl animate-pulse">
              <Search className="text-zinc-800" size={32} />
            </div>
            <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">
              No se encontraron registros en la bitácora
            </p>
          </div>
        )}

        {/* Improved Pagination Controls */}
        <footer className="bg-zinc-950/50 border-t border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Total: <span className="text-zinc-400">{filteredData.length}</span>{" "}
            actividades
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2.5 hover:bg-zinc-800 disabled:opacity-20 text-zinc-400 hover:text-white rounded-xl transition-all active:scale-90"
              title="Anterior"
            >
              <ChevronLeft size={20} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-1.5 px-4 min-w-[140px] justify-center">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                Página
              </span>
              <div className="bg-emerald-500/10 text-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border border-emerald-500/20">
                {currentPage}
              </div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                de {totalPages || 1}
              </span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2.5 hover:bg-zinc-800 disabled:opacity-20 text-zinc-400 hover:text-white rounded-xl transition-all active:scale-90"
              title="Siguiente"
            >
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
