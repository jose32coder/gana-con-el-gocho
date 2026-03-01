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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl overflow-y-auto">
      <div className="premium-card max-w-2xl w-full p-8 md:p-12 my-8 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 border-emerald-500/30">
        {/* Header de Exito */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
            {isValidated ? (
              <CheckCircle2 className="text-emerald-500" size={48} />
            ) : (
              <Clock className="text-orange-500 animate-pulse" size={48} />
            )}
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            {isValidated ? "¡Felicidades!" : "Tickets Registrados"}
          </h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
            {isValidated
              ? "Tu pago ha sido validado correctamente"
              : "Estamos terminando de validar tu pago manualmente"}
          </p>
        </div>

        {/* Card del Boleto */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-emerald-500/20 to-emerald-500/5 rounded-4xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-4xl p-8 md:p-10 space-y-8 overflow-hidden">
            {/* Decoración lateral de ticket */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-black rounded-r-full border-r border-zinc-900" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-black rounded-l-full border-l border-zinc-900" />

            <div className="flex justify-between items-start border-b border-zinc-900 pb-6 border-dashed">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Número de Folio
                </p>
                <p className="text-2xl font-mono font-black text-white">
                  {folio}
                </p>
              </div>
              <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-500 uppercase">
                  Activo
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Ticket className="text-emerald-500" size={20} />
                <p className="text-sm font-black text-white uppercase tracking-widest">
                  Tus Números Participantes
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {tickets.split(",").map((num, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-xl font-mono font-black text-emerald-400 shadow-xl"
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
            className="md:col-span-2 w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.3)] uppercase text-sm"
          >
            <Home size={18} />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
