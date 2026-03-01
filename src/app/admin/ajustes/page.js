"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import {
  Plus,
  Trash2,
  Landmark,
  Ticket,
  Settings2,
  Save,
  Smartphone,
} from "lucide-react";

export default function AjustesAdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState("pagos"); // 'pagos' o 'tickets'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Estados de Datos
  const [pagos, setPagos] = useState({
    pago_movil: { banco: "", telefono: "", cedula: "" },
    nequi: { numero: "", nombre: "" },
  });
  const [opcionesTickets, setOpcionesTickets] = useState([1, 10, 20]);

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from("configuracion").select("*");

      const configPagos = data?.find((i) => i.clave === "datos_pago");
      const configTickets = data?.find((i) => i.clave === "opciones_tickets");

      if (configPagos) {
        setPagos((prev) => ({
          ...prev,
          ...configPagos.valor,
          pago_movil: { ...prev.pago_movil, ...configPagos.valor?.pago_movil },
          nequi: { ...prev.nequi, ...configPagos.valor?.nequi },
        }));
      }
      if (configTickets) setOpcionesTickets(configTickets.valor);

      setLoading(false);
    }
    fetchConfig();
  }, [supabase]);

  // --- Lógica de Pagos ---
  const handlePagoChange = (metodo, field, value) => {
    setPagos((prev) => ({
      ...prev,
      [metodo]: { ...prev[metodo], [field]: value },
    }));
  };

  // --- Lógica de Tickets ---
  const actualizarOpcionTicket = (index, valor) => {
    const nuevas = [...opcionesTickets];
    nuevas[index] = Number(valor);
    setOpcionesTickets(nuevas);
  };
  const agregarOpcionTicket = () => setOpcionesTickets([...opcionesTickets, 0]);
  const eliminarOpcionTicket = (index) =>
    setOpcionesTickets(opcionesTickets.filter((_, i) => i !== index));

  // --- Guardar Todo ---
  const saveConfig = async () => {
    setSaving(true);
    const updates = [
      { clave: "datos_pago", valor: pagos },
      { clave: "opciones_tickets", valor: opcionesTickets },
    ];

    const { error } = await supabase
      .from("configuracion")
      .upsert(updates, { onConflict: "clave" });

    if (!error) {
      // Log Activity
      await supabase.from("actividades").insert([
        {
          tipo: "ajuste",
          descripcion: `Ajustes actualizados: ${tab === "pagos" ? "Datos de Pago" : "Opciones de Tickets"}`,
          monto: 0,
        },
      ]);

      setStatus({
        type: "success",
        message: "Configuración actualizada en la nube.",
      });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: "error", message: error.message });
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="py-20 text-center text-emerald-500 font-black animate-pulse uppercase tracking-widest text-xs">
        Cargando configuración...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-6">
      {/* MENÚ DE SELECCIÓN (TABS) */}
      <div className="flex bg-zinc-950 p-2 rounded-3xl border border-zinc-900 gap-2">
        <button
          onClick={() => setTab("pagos")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === "pagos" ? "bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)]" : "text-zinc-500 hover:text-white"}`}
        >
          <Landmark size={16} /> Datos de Pago
        </button>
        <button
          onClick={() => setTab("tickets")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${tab === "tickets" ? "bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)]" : "text-zinc-500 hover:text-white"}`}
        >
          <Ticket size={16} /> Opciones Tickets
        </button>
      </div>

      {status && (
        <div
          className={`p-5 rounded-3xl text-xs font-black uppercase tracking-widest border animate-in slide-in-from-top-4 duration-500 ${status.type === "success" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
        >
          {status.message}
        </div>
      )}

      {/* VISTA: CONFIGURACIÓN DE PAGOS */}
      {tab === "pagos" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PAGO MÓVIL */}
            <div className="premium-card p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Smartphone className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    Pago Móvil
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Venezuela
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    Banco
                  </label>
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="Ej: Banesco (0134)"
                    value={pagos?.pago_movil?.banco || ""}
                    onChange={(e) =>
                      handlePagoChange("pago_movil", "banco", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    Teléfono
                  </label>
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white font-mono focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="0412-1234567"
                    value={pagos?.pago_movil?.telefono || ""}
                    onChange={(e) =>
                      handlePagoChange("pago_movil", "telefono", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    Cédula
                  </label>
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="V-12345678"
                    value={pagos?.pago_movil?.cedula || ""}
                    onChange={(e) =>
                      handlePagoChange("pago_movil", "cedula", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* NEQUI */}
            <div className="premium-card p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Smartphone className="text-purple-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    Nequi
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Colombia
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    Número de Celular
                  </label>
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white font-mono focus:border-purple-500/50 outline-none transition-all"
                    placeholder="3001234567"
                    value={pagos?.nequi?.numero || ""}
                    onChange={(e) =>
                      handlePagoChange("nequi", "numero", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    Nombre Completo
                  </label>
                  <input
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-purple-500/50 outline-none transition-all"
                    placeholder="Ej: Juan Pérez"
                    value={pagos?.nequi?.nombre || ""}
                    onChange={(e) =>
                      handlePagoChange("nequi", "nombre", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA: CONFIGURACIÓN DE TICKETS */}
      {tab === "tickets" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white">
              Botones de Selección
            </h2>
            <button
              onClick={agregarOpcionTicket}
              className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white"
            >
              <Plus />
            </button>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {opcionesTickets.map((num, index) => (
              <div key={index} className="relative group">
                <input
                  type="number"
                  value={num}
                  onChange={(e) =>
                    actualizarOpcionTicket(index, e.target.value)
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center text-xl font-bold text-emerald-500 focus:border-emerald-500 outline-none"
                />
                <button
                  onClick={() => eliminarOpcionTicket(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm italic">
            Estos números aparecerán como botones rápidos en el selector de
            boletos del cliente.
          </p>
        </div>
      )}

      {/* BOTÓN FLOTANTE O FIJO PARA GUARDAR */}
      <button
        onClick={saveConfig}
        disabled={saving}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {saving ? (
          "Procesando..."
        ) : (
          <>
            <Save size={20} /> Guardar Cambios en la Nube
          </>
        )}
      </button>
    </div>
  );
}
