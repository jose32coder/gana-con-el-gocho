"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Edit3,
  Trash2,
  Pause,
  Play,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

const MySwal = withReactContent(Swal);

export default function RifasList({ initialRifas }) {
  const [rifas, setRifas] = useState(initialRifas);
  const supabase = createClient();
  const router = useRouter();

  const handleAction = async (rifa) => {
    const isPausada = rifa.estado === "pausada";
    const isFinalizada = rifa.estado === "finalizada";

    const { value: action } = await MySwal.fire({
      title: `<span class="uppercase font-black text-xl italic">${rifa.nombre}</span>`,
      html: `<p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">¿Qué deseas hacer con esta rifa?</p>`,
      icon: "question",
      showCancelButton: true,
      showDenyButton: !isFinalizada,
      confirmButtonText: isPausada ? "Reactivar" : "Pausar",
      denyButtonText: "Terminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: isPausada ? "#10b981" : "#f59e0b",
      denyButtonColor: "#ef4444",
      background: "#18181b",
      color: "#fff",
      customClass: {
        popup: "rounded-3xl border border-zinc-800 shadow-2xl",
        confirmButton: "rounded-xl font-black uppercase text-xs px-6 py-3 mx-1",
        denyButton: "rounded-xl font-black uppercase text-xs px-6 py-3 mx-1",
        cancelButton: "rounded-xl font-black uppercase text-xs px-6 py-3 mx-1",
      },
    });

    if (action === "cancel" || action === undefined) return;

    let nuevoEstado;
    if (action === true) {
      nuevoEstado = isPausada ? "activa" : "pausada";
    } else {
      nuevoEstado = "finalizada";
    }

    const { error } = await supabase
      .from("rifas")
      .update({ estado: nuevoEstado })
      .eq("id", rifa.id);

    if (error) {
      MySwal.fire("Error", error.message, "error");
    } else {
      await supabase.from("actividades").insert([
        {
          tipo: "ajuste",
          descripcion: `Rifa cambiada a ${nuevoEstado}: ${rifa.nombre}`,
          monto: 0,
          metadata: { rifa_id: rifa.id, nuevo_estado: nuevoEstado },
        },
      ]);

      MySwal.fire({
        title: "Actualizado",
        text: `La rifa ahora está ${nuevoEstado}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#18181b",
        color: "#fff",
      });

      router.refresh();
      setRifas(
        rifas.map((r) =>
          r.id === rifa.id ? { ...r, estado: nuevoEstado } : r,
        ),
      );
    }
  };

  const getStatusConfig = (estado) => {
    switch (estado) {
      case "activa":
        return {
          label: "Activa",
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: <CheckCircle2 size={12} />,
        };
      case "pausada":
        return {
          label: "Pausada",
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: <Clock size={12} />,
        };
      default:
        return {
          label: "Finalizada",
          color: "text-zinc-500",
          bg: "bg-zinc-800",
          border: "border-zinc-700",
          icon: <AlertCircle size={12} />,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rifas?.map((rifa) => {
        const status = getStatusConfig(rifa.estado);
        const recaudado =
          (rifa.boletos_vendidos || 0) * (rifa.precio_boleto || 0);

        return (
          <div
            key={rifa.id}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Image Section */}
            <div className="relative aspect-16/10 overflow-hidden">
              <Image
                src={rifa.imagen_url || "/placeholder-rifa.jpg"}
                alt={rifa.nombre}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-zinc-900 to-transparent" />

              {/* Status Badge Over Image */}
              <div
                className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md border ${status.bg} ${status.border} ${status.color}`}
              >
                {status.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {status.label}
                </span>
              </div>

              {/* Price Tag Over Image */}
              <div className="absolute bottom-6 right-6 flex flex-col items-end">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                  Precio Ticket
                </span>
                <div className="bg-emerald-500 text-black px-4 py-2 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20">
                  {rifa.precio_boleto.toLocaleString()} Bs
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-6 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 group-hover:text-emerald-500 transition-colors">
                      {rifa.nombre}
                    </h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Ticket size={10} className="text-emerald-500" /> ID:{" "}
                      {rifa.id.substring(0, 8)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-sans">
                    <Ticket size={10} /> Vendidos
                  </p>
                  <p className="text-[14px] md:text-lg font-black text-white">
                    {rifa.boletos_vendidos}{" "}
                    <span className="text-[10px] text-zinc-600">
                      / {rifa.total_boletos}
                    </span>
                  </p>
                </div>
                <div className="bg-zinc-950/50 p-4 rounded-3xl border border-zinc-800/50">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-sans">
                    Recaudado
                  </p>
                  <p className="text-[14px] md:text-lg font-black text-emerald-500">
                    {recaudado.toLocaleString()} Bs
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/admin/rifas/${rifa.id}/editar`}
                  className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 border border-zinc-700 text-xs uppercase tracking-widest"
                >
                  <Edit3 size={14} /> Editar
                </Link>
                <button
                  onClick={() => handleAction(rifa)}
                  className="px-6 flex items-center justify-center bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-white rounded-2xl transition-all active:scale-95 border border-zinc-700 hover:border-red-500/20 group/btn"
                >
                  {rifa.estado === "pausada" ? (
                    <Play size={18} fill="currentColor" />
                  ) : rifa.estado === "activa" ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {(!rifas || rifas.length === 0) && (
        <div className="col-span-full py-32 text-center bg-zinc-900/50 border border-zinc-800 border-dashed rounded-[3rem]">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket size={40} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">
            No hay rifas registradas
          </p>
          <Link
            href="/admin/rifas/nueva"
            className="inline-block mt-6 text-emerald-500 hover:text-emerald-400 font-black text-xs uppercase underline decoration-emerald-500/30 underline-offset-8"
          >
            Crear mi primera rifa
          </Link>
        </div>
      )}
    </div>
  );
}
