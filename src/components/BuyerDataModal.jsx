"use client";

import { User, IdCard, Phone, Mail, X } from "lucide-react";

export default function BuyerDataModal({
  isOpen,
  onClose,
  onSubmit,
  onBack,
  formData,
  setFormData,
  procesando,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto pt-10 pb-10">
      <div className="premium-card max-w-xl w-full p-5 md:p-10 space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-300 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
            Tus Datos
          </h2>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Ingresa la información para tu registro
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Nombre y Apellido
              </label>
              <div className="relative group">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Cédula / ID
              </label>
              <div className="relative group">
                <IdCard
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={formData.cedula}
                  onChange={(e) =>
                    setFormData({ ...formData, cedula: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="V-12345678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                WhatsApp
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="04121234567"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                  placeholder="juan@email.com"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full py-5 text-zinc-500 hover:text-white font-black uppercase tracking-widest text-sm transition-colors border border-zinc-800 rounded-2xl order-2 sm:order-1"
            >
              Regresar
            </button>
            <button
              type="submit"
              disabled={procesando}
              className="premium-button w-full py-5 text-lg order-1 sm:order-2"
            >
              {procesando ? "Guardando..." : "Continuar al Pago"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
