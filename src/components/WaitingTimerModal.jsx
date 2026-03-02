"use client";

import { useState, useEffect } from "react";
import { Timer, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-client";

export default function WaitingTimerModal({
  isOpen,
  boletoId,
  onValidated,
  onTimeout,
}) {
  const [seconds, setSeconds] = useState(180); // 3 minutos
  const supabase = createClient();

  useEffect(() => {
    if (!isOpen || !boletoId) return;

    // Cronómetro
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Llamar al timeout fuera del proceso de actualización de estado
          setTimeout(() => onTimeout(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling (cada 5 segundos)
    const polling = setInterval(async () => {
      const { data, error } = await supabase
        .from("boletos")
        .select("estado, numero_boleto")
        .eq("id", boletoId)
        .single();

      if (data && data.estado === "pagado") {
        clearInterval(timer);
        clearInterval(polling);
        onValidated(data.numero_boleto);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(polling);
    };
  }, [isOpen, boletoId, onValidated, onTimeout, supabase]);

  if (!isOpen) return null;

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="premium-card max-w-md w-full p-10 space-y-8 animate-in fade-in zoom-in duration-500 text-center border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-zinc-900 border-t-emerald-500 animate-spin mx-auto" />
          <Timer
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500"
            size={32}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Validando Pago
          </h2>
          <div className="bg-zinc-950/50 py-3 px-6 rounded-2xl border border-zinc-800 inline-block">
            <span className="text-4xl font-mono font-black text-emerald-500 tracking-widest">
              {formatTime(seconds)}
            </span>
          </div>
          <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
            Estamos verificando tu referencia. Por favor,{" "}
            <span className="text-white">no cierres ni actualices</span> esta
            ventana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-left">
            <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
            <p className="text-[10px] text-zinc-400 font-bold uppercase leading-tight">
              Tu folio ha sido registrado y está en cola de validación
              prioritaria.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left">
            <AlertCircle className="text-zinc-600 shrink-0" size={20} />
            <p className="text-[10px] text-zinc-500 font-bold uppercase leading-tight">
              Si tu pago no es validado en 3 minutos, podrás ver tus tickets
              igualmente mientras terminamos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
