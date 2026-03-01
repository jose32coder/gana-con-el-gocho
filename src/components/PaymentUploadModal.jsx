"use client";

import { useState, useRef } from "react";
import { Upload, Smartphone, CheckCircle, X, Camera } from "lucide-react";
import PaymentDetails from "./PaymentDetails";

export default function PaymentUploadModal({
  isOpen,
  onClose,
  onFinish,
  method,
  amount,
  folio,
  procesando,
}) {
  const [referencia, setReferencia] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor sube el comprobante de pago");
    if (referencia.length !== 6)
      return alert("La referencia debe tener 6 dígitos");

    onFinish(file, referencia);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="premium-card max-w-2xl w-full p-8 md:p-10 my-8 space-y-8 animate-in fade-in zoom-in duration-300 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 mb-4">
            <Smartphone className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
            Finalizar Compra
          </h2>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Sube tu comprobante para validar tu pago
          </p>
        </div>

        <div className="bg-zinc-950/50 rounded-3xl border border-zinc-800 overflow-hidden">
          <PaymentDetails method={method} amount={amount} folio={folio} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Últimos 6 dígitos de la referencia
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={referencia}
                onChange={(e) =>
                  setReferencia(e.target.value.replace(/\D/g, ""))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white text-center text-2xl font-mono focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-800"
                placeholder="000000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Adjunta tu comprobante de pago
              </label>
              <div
                onClick={() => fileInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-zinc-950/30 group ${
                  preview
                    ? "border-emerald-500/50"
                    : "border-zinc-800 hover:border-emerald-500/30"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {preview ? (
                  <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-zinc-800">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={32} />
                      <span className="ml-2 text-white font-bold uppercase text-xs">
                        Cambiar Imagen
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold uppercase text-xs tracking-widest">
                        Haz clic o arrastra tu comprobante
                      </p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">
                        PNG, JPG hasta 5MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={procesando || !file || referencia.length !== 6}
            className="premium-button w-full py-5 text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={24} />
            {procesando ? "Verificando Pago..." : "Finalizar y Pagar"}
          </button>
        </form>
      </div>
    </div>
  );
}
