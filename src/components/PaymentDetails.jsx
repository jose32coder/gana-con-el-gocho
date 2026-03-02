"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { Copy, Smartphone } from "lucide-react";
import Swal from "sweetalert2";

export default function PaymentDetails({ method, amount, folio }) {
  const [dynamicData, setDynamicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPaymentConfig() {
      const { data } = await supabase
        .from("configuracion")
        .select("valor")
        .eq("clave", "datos_pago")
        .single();

      if (data) {
        setDynamicData(data.valor);
      }
      setLoading(false);
    }
    fetchPaymentConfig();
  }, [supabase]);

  const copyToClipboard = (text, label) => {
    // Fallback para contextos no seguros (IP sin HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess(label);
      });
    } else {
      // Fallback usando textarea
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        showSuccess(label);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const showSuccess = (label) => {
    Swal.fire({
      title: "Copiado",
      text: `${label} copiado al portapapeles`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      background: "#18181b",
      color: "#ffffff",
    });
  };

  if (loading)
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">
          Cargando datos de pago...
        </p>
      </div>
    );

  const getMethodConfig = (methodKey, data) => {
    const configs = {
      pago_movil: {
        title: "Pago Móvil",
        icon: <Smartphone className="text-emerald-500" />,
        fields: {
          banco: "Banco",
          telefono: "Teléfono",
          cedula: "Cédula",
        },
      },
      nequi: {
        title: "Nequi",
        icon: <Smartphone className="text-emerald-500" />,
        fields: {
          numero: "Número",
          nombre: "Nombre",
        },
      },
      zelle: {
        title: "Zelle",
        icon: <Smartphone className="text-emerald-500" />,
        fields: {
          correo: "Correo",
          nombre: "Nombre",
        },
      },
    };

    const config = configs[methodKey] || configs.pago_movil;
    const methodData = data?.[methodKey] || {};

    return {
      title: config.title,
      icon: config.icon,
      details: Object.keys(config.fields).map((fieldKey) => ({
        label: config.fields[fieldKey],
        value: methodData[fieldKey] || "No configurado",
      })),
    };
  };

  const data = getMethodConfig(method, dynamicData);

  const copyAll = () => {
    const allText = data.details
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n");
    copyToClipboard(allText, "Todos los datos");
  };

  return (
    <div className="premium-card p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          {data.icon}
        </div>
        <h3 className="text-2xl text-white">{data.title}</h3>
        <p className="text-zinc-500 text-sm">
          Realiza la transferencia por el monto exacto para validar tu compra.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              Monto a Transferir
            </p>
            <p className="text-2xl font-black text-emerald-500">
              ${amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
              Folio de Registro
            </p>
            <p className="text-sm font-mono text-white">{folio}</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
          {data.details.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                  {item.label}
                </p>
                <p className="font-bold text-white text-lg">{item.value}</p>
              </div>
              <button
                onClick={() => copyToClipboard(item.value, item.label)}
                className="p-3 bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all group"
              >
                <Copy
                  size={18}
                  className="text-zinc-500 group-hover:text-emerald-500 transition-colors"
                />
              </button>
            </div>
          ))}

          {/* BOTÓN COPIAR TODO */}
          <button
            onClick={copyAll}
            className="w-full py-4 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
          >
            <Copy
              size={12}
              className="group-hover:scale-110 transition-transform"
            />
            Copiar todos los datos
          </button>
        </div>
      </div>

      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest text-center leading-relaxed">
          ⚠️ Importante: Asegurate de colocar correctamente la referencia de tu
          pago para la activación inmediata de tus tickets.
        </p>
      </div>
    </div>
  );
}
