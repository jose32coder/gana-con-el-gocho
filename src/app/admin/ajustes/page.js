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
  X,
  Send,
} from "lucide-react";

export default function AjustesAdminPage() {
  const supabase = createClient();
  const [tab, setTab] = useState("pagos"); // 'pagos' o 'tickets'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [status, setStatus] = useState(null);

  const [pagos, setPagos] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMethodType, setSelectedMethodType] = useState("");
  const [opcionesTickets, setOpcionesTickets] = useState([1, 10, 20]);

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from("configuracion").select("*");

      const configPagos = data?.find((i) => i.clave === "datos_pago");
      const configTickets = data?.find((i) => i.clave === "opciones_tickets");

      if (configPagos) {
        setPagos(configPagos.valor || {});
      }
      if (configTickets) setOpcionesTickets(configTickets.valor);

      setLoading(false);
    }
    fetchConfig();
  }, [supabase]);

  const handlePagoChange = (metodo, field, value) => {
    setPagos((prev) => ({
      ...prev,
      [metodo]: { ...prev[metodo], [field]: value },
    }));
  };

  const agregarMetodo = () => {
    if (!selectedMethodType) return;
    const defaults = {
      pago_movil: { banco: "", telefono: "", cedula: "" },
      nequi: { numero: "", nombre: "" },
      zelle: { correo: "", nombre: "" },
    };
    setPagos((prev) => ({
      ...prev,
      [selectedMethodType]: defaults[selectedMethodType],
    }));
    setShowAddModal(false);
    setSelectedMethodType("");
  };

  const eliminarMetodo = (metodo) => {
    const nuevos = { ...pagos };
    delete nuevos[metodo];
    setPagos(nuevos);
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

  // --- Probar Telegram ---
  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    try {
      const res = await fetch("/api/admin/test-telegram", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          message: "Mensaje de prueba enviado a Telegram.",
        });
      } else {
        throw new Error(data.error || "Error al enviar mensaje");
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setTestingTelegram(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

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
        {/* <button
          onClick={handleTestTelegram}
          disabled={testingTelegram}
          className="px-6 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-all disabled:opacity-50"
          title="Probar Notificaciones de Telegram"
        >
          <Send size={16} className={testingTelegram ? "animate-ping" : ""} />
          <span className="hidden md:inline">Probar Bot</span>
        </button> */}
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Métodos de Pago Activos
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-800 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <Plus size={14} /> Añadir Método
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARDS DINÁMICAS */}
            {Object.keys(pagos).map((key) => {
              if (key === "pago_movil") {
                return (
                  <div
                    key={key}
                    className="premium-card p-8 space-y-6 relative group"
                  >
                    <button
                      onClick={() => eliminarMetodo(key)}
                      className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
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
                      {["banco", "telefono", "cedula"].map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                            {field}
                          </label>
                          <input
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-emerald-500/50 outline-none transition-all"
                            placeholder={`Ej: ${field === "banco" ? "Banesco" : field === "telefono" ? "0412..." : "V-..."}`}
                            value={pagos[key][field] || ""}
                            onChange={(e) =>
                              handlePagoChange(key, field, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (key === "nequi") {
                return (
                  <div
                    key={key}
                    className="premium-card p-8 space-y-6 relative group"
                  >
                    <button
                      onClick={() => eliminarMetodo(key)}
                      className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
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
                      {["numero", "nombre"].map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                            {field === "numero"
                              ? "Número de Celular"
                              : "Nombre Completo"}
                          </label>
                          <input
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-purple-500/50 outline-none transition-all"
                            placeholder={
                              field === "numero" ? "300..." : "Juan..."
                            }
                            value={pagos[key][field] || ""}
                            onChange={(e) =>
                              handlePagoChange(key, field, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (key === "zelle") {
                return (
                  <div
                    key={key}
                    className="premium-card p-8 space-y-6 relative group"
                  >
                    <button
                      onClick={() => eliminarMetodo(key)}
                      className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <Smartphone className="text-blue-500" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                          Zelle
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          USA / Internacional
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {["correo", "nombre"].map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                            {field === "correo"
                              ? "Correo Electrónico"
                              : "Nombre Titular"}
                          </label>
                          <input
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:border-blue-500/50 outline-none transition-all"
                            placeholder={
                              field === "correo" ? "ejemplo@..." : "Titular..."
                            }
                            value={pagos[key][field] || ""}
                            onChange={(e) =>
                              handlePagoChange(key, field, e.target.value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {Object.keys(pagos).length === 0 && (
              <div className="md:col-span-2 py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-500">
                <Landmark size={40} className="mb-4 opacity-20" />
                <p className="font-black text-[10px] uppercase tracking-widest">
                  No hay métodos de pago configurados
                </p>
              </div>
            )}
          </div>

          {/* MODAL DE AGREGAR MÉTODO */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                    Añadir Método
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      id: "pago_movil",
                      name: "Pago Móvil",
                      region: "Venezuela",
                    },
                    { id: "nequi", name: "Nequi", region: "Colombia" },
                    { id: "zelle", name: "Zelle", region: "Internacional" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      disabled={!!pagos[m.id]}
                      onClick={() => setSelectedMethodType(m.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedMethodType === m.id ? "bg-emerald-500/10 border-emerald-500" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"} ${!!pagos[m.id] ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-black text-white uppercase tracking-tighter">
                          {m.name}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-500">
                          {m.region}
                        </p>
                      </div>
                      {!!pagos[m.id] && (
                        <span className="text-[8px] font-black text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full uppercase">
                          Ya activo
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={agregarMetodo}
                  disabled={!selectedMethodType}
                  className="w-full bg-white text-zinc-950 font-black py-4 rounded-2xl hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  Agregar Seleccionado
                </button>
              </div>
            </div>
          )}
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
