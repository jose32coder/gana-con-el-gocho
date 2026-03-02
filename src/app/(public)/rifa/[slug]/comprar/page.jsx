"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { Smartphone } from "lucide-react";
import withReactContent from "sweetalert2-react-content";

// Nuevos Componentes
import TermsModal from "@/components/TermsModal";
import TopBuyers from "@/components/TopBuyers";
import PaymentMethodModal from "@/components/PaymentMethodModal";
import TicketSelector from "@/components/TicketSelector";
import BuyerDataModal from "@/components/BuyerDataModal";
import PaymentUploadModal from "@/components/PaymentUploadModal";
import WaitingTimerModal from "@/components/WaitingTimerModal";
import TicketsResultModal from "@/components/TicketsResultModal";

const MySwal = withReactContent(Swal);

export default function ComprarRifaPage(props) {
  const params = use(props.params);
  const slug = params.slug;

  const supabase = createClient();
  const router = useRouter();

  const [rifa, setRifa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos del Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    correo: "",
  });

  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState("");

  // Modales
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [datosCompra, setDatosCompra] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Estados de Validación en Tiempo Real
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [activeBoletoId, setActiveBoletoId] = useState(null);
  const [finalTickets, setFinalTickets] = useState("");
  const [finalFolio, setFinalFolio] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const totalActual = rifa
    ? Number((cantidad * rifa.precio_boleto).toFixed(2))
    : 0;
  const MIN_TICKETS = 1; // Mínimo absoluto de la plataforma

  useEffect(() => {
    async function fetchRifa() {
      const { data, error } = await supabase
        .from("rifas")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) setRifa(data);
      setLoading(false);
    }
    if (slug) fetchRifa();
  }, [slug, supabase]);

  // Handlers para el flujo
  const handleSelectMethod = (methodId) => {
    setMetodoPago(methodId);
    setIsMethodModalOpen(false);
    setIsDataModalOpen(true);
  };

  const handleDataSubmit = () => {
    setIsDataModalOpen(false);
    setIsUploadModalOpen(true);
  };

  const handleFinalizarCompra = async (file, referencia) => {
    setProcesando(true);
    try {
      // 1. Generar Folio
      const folio = `RIFA-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      // 2. Subir imagen a Cloudinary (API propia)
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "comprobantes");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();

      if (!uploadResult.url) {
        throw new Error(
          `Error al subir el comprobante: ${uploadResult.error || "Desconocido"}`,
        );
      }

      // 3. Registrar en base de datos (Endpoint API)
      const res = await fetch("/api/comprar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rifa_id: rifa.id,
          cantidad,
          monto: totalActual,
          ...formData, // nombre, cedula, telefono, correo
          metodo_pago: metodoPago,
          referencia_pago: referencia,
          comprobante_url: uploadResult.url,
          folio: folio,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setIsUploadModalOpen(false);
        setActiveBoletoId(result.id);
        setFinalFolio(folio);
        setFinalTickets(result.numeros.join(", "));
        setIsTimerModalOpen(true);
      } else {
        throw new Error(result.error || "Error al procesar la compra");
      }
    } catch (err) {
      MySwal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        background: "#18181b",
        color: "#fff",
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleTimerValidated = (ticketNumbers) => {
    setIsTimerModalOpen(false);
    setFinalTickets(ticketNumbers);
    setIsValidated(true);
    setIsResultModalOpen(true);
  };

  const handleTimerTimeout = () => {
    setIsTimerModalOpen(false);
    setIsValidated(false);
    setIsResultModalOpen(true);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );

  if (!rifa)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Rifa no encontrada
      </div>
    );

  return (
    <main className="min-h-screen bg-black py-12 px-6">
      <TermsModal />

      {/* Modales del Flujo */}
      <PaymentMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
        onSelect={handleSelectMethod}
        totalAmount={totalActual}
        ticketCount={cantidad}
      />

      <BuyerDataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        onBack={() => {
          setIsDataModalOpen(false);
          setIsMethodModalOpen(true);
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleDataSubmit}
      />

      <PaymentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onBack={() => {
          setIsUploadModalOpen(false);
          setIsDataModalOpen(true);
        }}
        onFinish={handleFinalizarCompra}
        method={metodoPago}
        amount={totalActual}
        folio="GENERANDO..."
        procesando={procesando}
      />

      <WaitingTimerModal
        isOpen={isTimerModalOpen}
        boletoId={activeBoletoId}
        onValidated={handleTimerValidated}
        onTimeout={handleTimerTimeout}
      />

      <TicketsResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        tickets={finalTickets}
        folio={finalFolio}
        isValidated={isValidated}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header con Imagen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video lg:aspect-square rounded-4xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src={rifa.imagen_url || "/placeholder-rifa.jpg"}
              alt={rifa.nombre}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black p-8">
              <h1 className="text-4xl md:text-5xl text-white">{rifa.nombre}</h1>
              <p className="text-emerald-500 font-bold text-xl mt-2">
                {rifa.precio_boleto} BS{" "}
                <span className="text-zinc-500 text-sm font-normal uppercase">
                  Por Ticket
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <TopBuyers buyers={rifa.top_compradores || []} />

            <div className="premium-card p-8">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                <span className="text-emerald-500">
                  {rifa.boletos_vendidos} Vendidos
                </span>
                <span>
                  {Math.round(
                    (rifa.boletos_vendidos / rifa.total_boletos) * 100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-900">
                <div
                  className="bg-emerald-500 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000"
                  style={{
                    width: `${(rifa.boletos_vendidos / rifa.total_boletos) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Único paso en página: Selección de cantidad */}
          <div className="premium-card p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl text-white">Elige la cantidad</h2>
              <p className="text-zinc-500">Mínimo 1 ticket para participar.</p>
            </div>

            <TicketSelector
              cantidad={cantidad}
              setCantidad={setCantidad}
              precioUnitario={rifa.precio_boleto}
            />

            <button
              onClick={() => setIsMethodModalOpen(true)}
              disabled={cantidad < MIN_TICKETS}
              className="premium-button w-full text-lg disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
