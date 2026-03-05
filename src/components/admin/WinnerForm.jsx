import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Search, Ticket } from "lucide-react";

export default function WinnerForm({ initialData = null, onCancel }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ticket Seeker State
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketResult, setTicketResult] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    rifa_nombre: initialData?.rifa_nombre || "",
    fecha: initialData?.fecha || new Date().toISOString().split("T")[0],
    hora: initialData?.hora || "13:00:00",
    descripcion: initialData?.descripcion || "",
    imagen_url: initialData?.imagen_url || "",
    activo: initialData?.activo !== undefined ? initialData.activo : true,
    numero_boleto: initialData?.numero_boleto || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buscarTicket = async () => {
    if (!ticketSearch) return;
    setLoadingTicket(true);
    setTicketResult(null);

    // Search in numero_ticket because it's the column that likely stores the numbers
    // Based on the schema it's actually numero_boleto in the DB but the UI uses numero_ticket in some places
    // Let's check both or just what's in the DB
    const { data, error } = await supabase
      .from("boletos")
      .select("*, rifas(nombre)")
      .ilike("numero_boleto", `%${ticketSearch}%`)
      .limit(5);

    if (data && data.length > 0) {
      setTicketResult(data);
    } else {
      setTicketResult([]);
    }
    setLoadingTicket(false);
  };

  const selectTicket = (ticketNum, comprador, rifa) => {
    // If ticketNum is a list, we just take the first one or let the user decide
    // For now we take the string as is
    setFormData((prev) => ({
      ...prev,
      numero_boleto: ticketNum,
      nombre: comprador,
      rifa_nombre: rifa,
    }));
    setTicketResult(null);
    setTicketSearch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (initialData?.id) {
      result = await supabase
        .from("ganadores")
        .update(formData)
        .eq("id", initialData.id);
    } else {
      result = await supabase.from("ganadores").insert([formData]).select();
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.error.message,
        confirmButtonColor: "#10b981",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: initialData?.id ? "Actualizado" : "Guardado",
        text: "La información del ganador se ha procesado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });
      router.refresh();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl overflow-hidden relative shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
          {initialData ? "Editar" : "Nuevo"}{" "}
          <span className="text-emerald-500">Ganador</span>
        </h2>

        <label className="flex items-center gap-3 cursor-pointer group">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
            {formData.activo ? "Visible" : "Oculto"}
          </span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
          </div>
        </label>
      </div>

      {/* Ticket Seeker Tool */}
      <div className="bg-zinc-950/50 border border-zinc-800 border-dashed rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Buscador de Tickets Comprados
            </span>
          </div>
          <div className="relative w-full sm:max-w-[200px]">
            <input
              type="text"
              placeholder="Escribe un número..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), buscarTicket())
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 pr-10"
            />
            <button
              type="button"
              onClick={buscarTicket}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-500 transition-colors"
            >
              {loadingTicket ? "..." : "🔍"}
            </button>
          </div>
        </div>

        {ticketResult && (
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pt-2 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-2">
            {ticketResult.length > 0 ? (
              ticketResult.map((t) => (
                <div
                  key={t.id}
                  className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Ticket size={14} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">
                        {t.numero_boleto}
                      </p>
                      <p className="text-[9px] text-zinc-500 uppercase font-bold truncate max-w-[150px]">
                        {t.comprador_nombre} • {t.rifas?.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${t.estado === "pagado" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}
                    >
                      {t.estado}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        selectTicket(
                          t.numero_boleto,
                          t.comprador_nombre,
                          t.rifas?.nombre,
                        )
                      }
                      className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-all uppercase tracking-tighter"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-zinc-600 text-center font-bold uppercase py-2">
                No se encontró ningún ticket con ese número
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
            Nombre del Ganador
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold placeholder:font-normal"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
            Número de Ticket
          </label>
          <input
            type="text"
            name="numero_boleto"
            value={formData.numero_boleto}
            onChange={handleChange}
            placeholder="Ej: 0584"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-mono font-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
            Rifa / Premio
          </label>
          <input
            type="text"
            name="rifa_nombre"
            value={formData.rifa_nombre}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold placeholder:font-normal"
            placeholder="Ej: iPhone 15 Pro Max"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Hora
            </label>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer font-bold"
            >
              <option value="13:00:00">1:00 PM</option>
              <option value="16:00:00">4:00 PM</option>
              <option value="22:00:00">10:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
          Descripción / Mensaje
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="2"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none font-medium placeholder:font-normal text-sm"
          placeholder="Ej: Entregado personalmente..."
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
          Foto del Ganador
        </label>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-32 h-32 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden relative group shrink-0">
            {formData.imagen_url ? (
              <>
                <Image
                  src={formData.imagen_url}
                  alt="Preview"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, imagen_url: "" }))
                  }
                  className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm text-white p-1.5 rounded-lg flex items-center justify-center text-[10px] cursor-pointer hover:bg-red-500 transition-colors z-20"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                <span className="text-2xl mb-1 opacity-20">📸</span>
                <p className="text-[8px] font-black uppercase tracking-widest">
                  Sin foto
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 p-5 rounded-3xl text-center space-y-2 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLoading(true);
                  const uploadData = new FormData();
                  uploadData.append("file", file);
                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: uploadData,
                    });
                    const data = await res.json();
                    if (data.url)
                      setFormData((prev) => ({
                        ...prev,
                        imagen_url: data.url,
                      }));
                    else
                      Swal.fire(
                        "Error",
                        data.error || "No se pudo subir",
                        "error",
                      );
                  } catch (err) {
                    Swal.fire("Error", "Error en el servidor", "error");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="relative z-0">
                <div className="flex items-center justify-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-500"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <h4 className="text-white font-black uppercase tracking-tighter text-xs">
                    Subir Foto
                  </h4>
                </div>
                <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest mt-1">
                  Recomendado: 800x800px
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 text-black font-black px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all transform active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20"
        >
          {loading
            ? "Procesando..."
            : initialData?.id
              ? "Actualizar"
              : "Guardar Ganador"}
        </button>
      </div>
    </form>
  );
}
