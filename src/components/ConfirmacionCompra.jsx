import Link from "next/link";

export default function ConfirmacionCompra({ datos }) {
  // Nota: Ya no generamos el mensaje de WhatsApp aquí porque el usuario ya envió su comprobante en el paso anterior.
  // Pero podemos dejarlo como opción por si quiere contactar de nuevo.

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow de éxito */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full"></div>

        <div className="w-20 h-20 bg-emerald-500 text-black rounded-full flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          ✓
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            ¡Pago Confirmado!
          </h2>
          <p className="text-zinc-400 text-sm">
            Tu participación ha sido validada por el administrador.
          </p>
        </div>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-left">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">
            Tus Tickets Oficiales (#F-{datos.folio})
          </p>
          <div className="flex flex-wrap gap-2">
            {datos.numeros.map((num) => (
              <span
                key={num}
                className="bg-emerald-500/10 text-emerald-500 font-mono font-bold px-4 py-2 rounded-xl border border-emerald-500/20 text-lg shadow-inner"
              >
                #{num.toString().padStart(4, "0")}
              </span>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Propietario
              </p>
              <p className="text-sm font-bold text-white uppercase">
                {datos.nombre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Total Pagado
              </p>
              <p className="text-sm font-black text-emerald-500">
                ${datos.total} BS
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="w-full bg-white text-zinc-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl hover:bg-zinc-100"
          >
            ACEPTAR Y VOLVER AL INICIO
          </Link>
          <p className="text-[10px] text-zinc-500 mt-6 uppercase font-bold tracking-widest">
            ¡Mucha suerte en el sorteo!
          </p>
        </div>
      </div>
    </div>
  );
}
