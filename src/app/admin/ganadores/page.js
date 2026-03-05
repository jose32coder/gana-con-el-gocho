"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import WinnerForm from "@/components/admin/WinnerForm";
import Image from "next/image";
import Swal from "sweetalert2";

export default function AdminGanadoresPage() {
  const supabase = createClient();
  const [ganadores, setGanadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);

  const fetchGanadores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ganadores")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setGanadores(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGanadores();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#18181b",
      color: "#fff",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("ganadores").delete().eq("id", id);
      if (!error) {
        Swal.fire({
          title: "Eliminado",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#18181b",
          color: "#fff",
        });
        fetchGanadores();
      }
    }
  };

  const handleToggleActive = async (winner) => {
    const { error } = await supabase
      .from("ganadores")
      .update({ activo: !winner.activo })
      .eq("id", winner.id);

    if (!error) fetchGanadores();
  };

  const handleEdit = (winner) => {
    setEditingWinner(winner);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWinner(null);
    fetchGanadores();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Gestión de{" "}
            <span className="text-emerald-500 text-glow">Ganadores</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
            Administra el Hall of Fame de la web
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 text-black font-black px-8 py-4 rounded-2xl hover:bg-emerald-400 transition-all transform active:scale-95 shadow-lg shadow-emerald-500/20 uppercase text-xs tracking-widest flex items-center gap-2"
        >
          <span>🏆</span> Añadir Ganador
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-100 flex items-start justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md overflow-y-auto pt-10 pb-10">
          <div className="max-w-3xl w-full">
            <WinnerForm
              initialData={editingWinner}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-zinc-900/50 rounded-3xl border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : ganadores.length === 0 ? (
        <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-4xl p-20 text-center">
          <div className="text-6xl mb-4 opacity-20">🏆</div>
          <h3 className="text-xl font-bold text-zinc-400 uppercase tracking-widest">
            No hay ganadores registrados
          </h3>
          <p className="text-zinc-600 mt-2 text-sm uppercase font-bold tracking-tight">
            Comienza añadiendo el primero para generar confianza
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ganadores.map((winner) => (
            <div
              key={winner.id}
              className={`group bg-zinc-900 border ${winner.activo ? "border-zinc-800 hover:border-emerald-500/50" : "border-zinc-800 opacity-60"} rounded-3xl overflow-hidden transition-all duration-500 relative`}
            >
              <div className="relative h-48 w-full">
                {winner.imagen_url ? (
                  <Image
                    src={winner.imagen_url}
                    alt={winner.nombre}
                    fill
                    className={`object-cover ${winner.activo ? "group-hover:scale-105" : "grayscale"} transition-transform duration-700`}
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-800">
                    🏆
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>

                <div className="absolute top-4 left-4">
                  <div
                    className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${winner.activo ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/20" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"}`}
                  >
                    {winner.activo ? "● Visible" : "○ Oculto"}
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleToggleActive(winner)}
                    title={
                      winner.activo ? "Ocultar de la web" : "Mostrar en la web"
                    }
                    className={`p-2 rounded-xl border border-white/10 backdrop-blur-md transition-all shadow-xl ${winner.activo ? "bg-zinc-900/80 text-white hover:bg-zinc-700" : "bg-emerald-500 text-black hover:bg-emerald-400"}`}
                  >
                    {winner.activo ? "👁️" : "✨"}
                  </button>
                  <button
                    onClick={() => handleEdit(winner)}
                    className="bg-zinc-900/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 hover:bg-blue-500 transition-all shadow-xl"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(winner.id)}
                    className="bg-zinc-900/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/10 hover:bg-red-500 transition-all shadow-xl"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white hover:text-emerald-500 transition-colors uppercase italic tracking-tight">
                    {winner.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                      WINNER
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {new Date(
                        winner.fecha + "T12:00:00",
                      ).toLocaleDateString()}{" "}
                      •{" "}
                      {(() => {
                        const [h, m] = winner.hora.split(":");
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? "PM" : "AM";
                        const formattedHour = hour % 12 || 12;
                        return `${formattedHour}:${m} ${ampm}`;
                      })()}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    {winner.numero_boleto && (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-mono font-black px-2 py-1 rounded-lg border border-emerald-500/20">
                        #{winner.numero_boleto}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Premio Ganado
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {winner.rifa_nombre}
                  </p>
                </div>

                {winner.descripcion && (
                  <p className="text-xs text-zinc-500 line-clamp-2 italic">
                    "{winner.descripcion}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
