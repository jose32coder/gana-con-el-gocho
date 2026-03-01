"use client";

import { useState, useEffect } from "react";

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("terms-accepted");
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("terms-accepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="premium-card max-w-2xl w-full p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <span className="text-4xl">📜</span>
          </div>
          <h2 className="text-3xl md:text-4xl text-white">
            Términos y Condiciones
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Para continuar y participar en nuestras rifas, debes aceptar
            nuestros términos de servicio. Esto incluye la política de
            reembolsos, la validación de pagos y la entrega de premios.
          </p>
        </div>

        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800 max-h-60 overflow-y-auto custom-scrollbar text-xs text-zinc-500 space-y-4">
          <p>
            1. <b>Participación:</b> Solo personas mayores de edad pueden
            participar.
          </p>
          <p>
            2. <b>Pagos:</b> Los pagos deben ser reportados con el comprobante
            exacto. No se aceptan transferencias de Mercado Pago.
          </p>
          <p>
            3. <b>Sorteos:</b> La fecha del sorteo está sujeta a la venta del
            80% de los boletos, a menos que se especifique lo contrario.
          </p>
          <p>
            4. <b>Premios:</b> Los premios se entregan personalmente o según lo
            acordado en la descripción de cada rifa.
          </p>
          <p>
            5. <b>Privacidad:</b> Tus datos son utilizados únicamente para la
            gestión del sorteo y contacto en caso de ganar.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="premium-button w-full text-lg"
        >
          Aceptar y Continuar
        </button>
      </div>
    </div>
  );
}
