"use client";

import {
  CheckCircle2,
  Ticket,
  Download,
  Home,
  Share2,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function TicketsResultModal({
  isOpen,
  onClose,
  tickets,
  folio,
  isValidated,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl overflow-y-auto pt-10 pb-10">
      <div className="premium-card max-w-2xl w-full p-5 md:p-12 space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 border-emerald-500/30">
        {/* Header de Exito */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-1">
            {isValidated ? (
              <CheckCircle2 className="text-emerald-500" size={32} />
            ) : (
              <Clock className="text-orange-500 animate-pulse" size={32} />
            )}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
            {isValidated ? "¡Felicidades!" : "Tickets Registrados"}
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            {isValidated
              ? "Tu pago ha sido validado correctamente"
              : "Estamos terminando de validar tu pago manualmente"}
          </p>
        </div>

        {/* Card del Boleto */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/20 to-emerald-500/5 rounded-4xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl md:rounded-4xl p-5 md:p-10 space-y-6 md:space-y-8 overflow-hidden">
            {/* Decoración lateral de ticket - Más sutil en móvil */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 md:w-6 h-8 md:h-12 bg-black rounded-r-full border-r border-zinc-900" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 md:w-6 h-8 md:h-12 bg-black rounded-l-full border-l border-zinc-900" />

            <div className="flex justify-between items-start border-b border-zinc-900 pb-5 border-dashed">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Número de Folio
                </p>
                <p className="text-xl md:text-2xl font-mono font-black text-white">
                  {folio}
                </p>
              </div>
              <div className="bg-emerald-500/10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-emerald-500/20">
                <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase">
                  Activo
                </p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <Ticket className="text-emerald-500" size={18} />
                <p className="text-xs md:text-sm font-black text-white uppercase tracking-widest">
                  Tus Números Participantes
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar justify-center md:justify-start">
                {tickets.split(",").map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-md md:text-xl font-mono font-black text-emerald-400 shadow-xl shrink-0"
                  >
                    {num.trim()}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[10px] font-bold text-zinc-600 uppercase">
              <p>Gana con el gocho</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="md:col-span-2 w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 md:py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase text-sm"
          >
            <Home size={18} />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
