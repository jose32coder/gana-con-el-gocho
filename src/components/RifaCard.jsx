// components/RifaCard.js
import Link from "next/link";
import Image from "next/image";

export default function RifaCard({ rifa }) {
  const progreso = (rifa.boletos_vendidos / rifa.total_boletos) * 100;
  const porcentaje = Math.round(
    (rifa.boletos_vendidos / rifa.total_boletos) * 100,
  );
  const colorClase =
    porcentaje > 90
      ? "text-orange-500"
      : "text-emerald-600 dark:text-emerald-400";

  // Luego en el JSX:
  <span className={colorClase}>{porcentaje}%</span>;

  return (
    <div className="group border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 flex flex-col">
      {/* Contenedor de Imagen con Efecto Hover */}
      <Link
        href={`/rifa/${rifa.slug}`}
        className="relative h-56 overflow-hidden block"
      >
        <Image
          src={rifa.imagen_url || "/placeholder-rifa.jpg"}
          alt={rifa.nombre}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-zinc-200 dark:border-zinc-700">
          <span className={colorClase}>{porcentaje}%</span>
          <span className="text-zinc-500 dark:text-zinc-400 ml-1">Vendido</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col grow">
        <Link href={`/rifa/${rifa.slug}`}>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide hover:text-emerald-500 transition-colors">
            {rifa.nombre}
          </h2>
        </Link>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {rifa.descripcion}
        </p>

        {/* Sección de Progreso mejorada */}
        <div className="mt-auto">
          <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-zinc-500">
            <div className="flex flex-col">
              <span className="text-emerald-500">
                {rifa.boletos_vendidos || 0} VENDIDOS
              </span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-zinc-400">
                {rifa.total_boletos - (rifa.boletos_vendidos || 0)} RESTANTES
              </span>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
              style={{ width: `${Math.min(progreso, 100)}%` }}
            ></div>
          </div>

          {/* Precio y Botones */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-auto">
            {/* Contenedor del Precio */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Costo
              </span>
              <span className="text-2xl sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                {rifa.precio_boleto}{" "}
                <span className="text-sm font-normal text-zinc-500">BS</span>
              </span>
            </div>

            {/* Contenedor de Botones - Toma ancho completo en móvil */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href={`/rifa/${rifa.slug}/comprar`}
                className="flex-1 text-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 sm:px-4 sm:py-2 rounded-xl font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95 duration-200"
              >
                Comprar
              </Link>
              <Link
                href={{
                  pathname: "/verificar",
                  query: { rifaId: rifa.id }, // El verificador aún puede usar ID o podemos cambiarlo luego
                }}
                as="/verificar" // Esto es el "truco": oculta el query en la barra de direcciones
                className="flex-1 text-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white py-4 sm:px-4 sm:py-2 rounded-xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 duration-200 border border-zinc-200 dark:border-zinc-700"
              >
                Verificar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
