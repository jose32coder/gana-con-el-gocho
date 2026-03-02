"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function RifaForm({ initialData = null }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    slug: initialData?.slug || "",
    descripcion: initialData?.descripcion || "",
    precio_boleto: initialData?.precio_boleto || "",
    total_boletos: initialData?.total_boletos || 1000,
    boletos_vendidos: initialData?.boletos_vendidos || 0,
    imagen_url: initialData?.imagen_url || "",
    estado: initialData?.estado || "activa",
    top_compradores: initialData?.top_compradores || [],
  });

  // Función para convertir texto en URL amigable
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize("NFD") // Quita acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-") // Reemplaza espacios por guiones
      .replace(/[^\w-]+/g, "") // Quita caracteres especiales
      .replace(/--+/g, "-"); // Evita guiones dobles
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Si el usuario cambia el nombre, actualizamos el slug automáticamente
      if (name === "nombre") {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleAddTopBuyer = () => {
    setFormData((prev) => ({
      ...prev,
      top_compradores: [...prev.top_compradores, { nombre: "", tickets: 0 }],
    }));
  };

  const handleRemoveTopBuyer = (index) => {
    setFormData((prev) => ({
      ...prev,
      top_compradores: prev.top_compradores.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTopBuyer = (index, field, value) => {
    setFormData((prev) => {
      const newList = [...prev.top_compradores];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, top_compradores: newList };
    });
  };

  const handleImportJSON = () => {
    const jsonString = prompt("Pega aquí el JSON de compradores:");
    if (!jsonString) return;
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setFormData((prev) => ({ ...prev, top_compradores: parsed }));
      } else {
        alert("El JSON debe ser una lista [ {...}, {...} ]");
      }
    } catch (e) {
      alert("Error al procesar el JSON: " + e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      precio_boleto: parseFloat(formData.precio_boleto),
      total_boletos: parseInt(formData.total_boletos),
      boletos_vendidos: parseInt(formData.boletos_vendidos) || 0,
      top_compradores: formData.top_compradores,
    };

    let result;
    if (initialData?.id) {
      result = await supabase
        .from("rifas")
        .update(payload)
        .eq("id", initialData.id);
    } else {
      result = await supabase.from("rifas").insert([payload]).select();
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      // Log Activity
      const action = initialData?.id ? "actualizada" : "creada";
      await supabase.from("actividades").insert([
        {
          tipo: "ajuste",
          descripcion: `Rifa ${action}: ${formData.nombre}`,
          monto: 0,
          metadata: {
            rifa_id: initialData?.id || result.data?.[0]?.id,
            accion: action,
          },
        },
      ]);

      router.push("/admin/rifas");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl overflow-hidden relative"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Nombre del Sorteo
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="Ej: Rifa Navideña iPhone 15"
          />
        </div>

        {/* Nuevo campo: Slug (Solo lectura o visible para confirmar) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            URL Amigable (Slug)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            readOnly // Lo dejamos solo lectura para evitar errores del usuario
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-zinc-500 cursor-not-allowed italic"
            placeholder="se-genera-solo"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all resize-none"
          placeholder="Escribe los detalles del premio y condiciones..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Precio por Boleto (BS)
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">
              $
            </span>
            <input
              type="number"
              name="precio_boleto"
              value={formData.precio_boleto}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Total de Boletos
          </label>
          <input
            type="number"
            name="total_boletos"
            value={formData.total_boletos}
            onChange={handleChange}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="1000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Vendidos (Simulado/Manual)
          </label>
          <input
            type="number"
            name="boletos_vendidos"
            value={formData.boletos_vendidos}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>
      </div>

      {/* URL de Imagen / Upload */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">
          Imagen del Sorteo
        </label>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Previsualización */}
          <div className="w-full md:w-64 h-64 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden relative group">
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
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl transition-opacity flex items-center gap-2 text-[10px] cursor-pointer font-black uppercase shadow-lg z-20"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Eliminar
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                <span className="text-4xl mb-2 opacity-20">📸</span>
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Sin imagen
                </p>
              </div>
            )}
          </div>

          {/* Botón de Carga */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 p-8 rounded-3xl text-center space-y-4 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
              <input
                type="file"
                accept="image/*"
                key={formData.imagen_url ? "has-image" : "no-image"}
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

                    if (data.url) {
                      setFormData((prev) => ({
                        ...prev,
                        imagen_url: data.url,
                      }));
                    } else {
                      alert("Error: " + (data.error || "No se pudo subir"));
                    }
                  } catch (err) {
                    alert("Error en la conexión con el servidor");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="relative z-0">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald-500"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h4 className="text-white font-bold uppercase tracking-tight">
                  Seleccionar Imagen
                </h4>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Sube el premio directamente a Cloudinary
                </p>
              </div>
            </div>

            <p className="mt-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
              * La imagen se actualizará automáticamente al seleccionar un
              archivo.
              <br />* Tamaño recomendado: 800x800px (Cuadrada).
            </p>
          </div>
        </div>
      </div>

      {/* Top Compradores (Editor de Lista) */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 px-1">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Top Compradores
            </label>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
              Lista visual de los mayores compradores para mostrar en la web.
            </p>
          </div>
          <div className="flex w-full justify-start md:w-auto gap-3">
            {/* <button
              type="button"
              onClick={handleImportJSON}
              className="text-[11px] font-black uppercase text-zinc-500 hover:text-emerald-500 transition-colors border border-zinc-800 px-3 py-2 rounded-xl"
            >
              Importar JSON
            </button> */}
            <button
              type="button"
              onClick={handleAddTopBuyer}
              className="text-[11px] w-full md:w-auto font-black uppercase bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/20 px-4 py-2 rounded-xl"
            >
              + Añadir
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {formData.top_compradores.length === 0 ? (
            <div className="text-center py-10 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                No hay compradores registrados
              </p>
            </div>
          ) : (
            formData.top_compradores.map((buyer, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center gap-3 bg-zinc-950/50 p-4 md:p-3 rounded-3xl md:rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <div className="flex-1 w-full">
                  <label className="md:hidden text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">
                    Nombre del Comprador
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre..."
                    value={buyer.nombre}
                    onChange={(e) =>
                      handleUpdateTopBuyer(idx, "nombre", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 md:py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="w-full md:w-32 flex items-end gap-3">
                  <div className="flex-1">
                    <label className="md:hidden text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1.5 block">
                      Boletos
                    </label>
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={buyer.tickets}
                      onChange={(e) =>
                        handleUpdateTopBuyer(
                          idx,
                          "tickets",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 md:py-2 text-sm text-white focus:border-emerald-500 outline-none font-mono text-center md:text-left"
                    />
                  </div>
                  <div className="md:hidden">
                    <button
                      type="button"
                      onClick={() => handleRemoveTopBuyer(idx)}
                      className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 flex items-center justify-center active:scale-90 transition-transform"
                      title="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTopBuyer(idx)}
                  className="hidden md:block p-2 text-zinc-600 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl font-bold text-zinc-500 hover:text-white transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-zinc-950 font-black px-10 py-4 rounded-2xl hover:bg-zinc-200 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : initialData?.id
              ? "Actualizar Rifa"
              : "Crear Rifa"}
        </button>
      </div>
    </form>
  );
}
