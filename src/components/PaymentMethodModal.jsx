"use client";

import { CreditCard, Landmark, Smartphone, Wallet } from "lucide-react";

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onSelect,
  totalAmount,
  ticketCount,
}) {
  if (!isOpen) return null;

  const methods = [
    {
      id: "pago_movil",
      name: "Pago Móvil",
      icon: <Smartphone className="text-emerald-500" />,
      detail: "Venezuela",
    },

    {
      id: "nequi",
      name: "Nequi",
      icon: <Smartphone className="text-emerald-500" />,
      detail: "Colombia",
    },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="premium-card max-w-xl w-full p-8 md:p-10 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              Total a Pagar
            </p>
            <p className="text-3xl font-black text-white">
              ${totalAmount.toLocaleString()}{" "}
              <span className="text-sm font-normal text-zinc-500 uppercase">
                BS
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              Tickets
            </p>
            <p className="text-2xl font-black text-emerald-500">
              {ticketCount}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl text-white text-center uppercase tracking-tighter">
            Selecciona tu método de pago
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => onSelect(method.id)}
                className="flex items-center gap-4 p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase">
                    {method.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {method.detail}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
