"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase-client";
import {
  Trophy,
  Calendar,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function WinnersSection() {
  const supabase = createClient();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      const { data } = await supabase
        .from("ganadores")
        .select("*")
        .eq("activo", true)
        .order("fecha", { ascending: false })
        .limit(10);
      if (data) setWinners(data);
      setLoading(false);
    }
    fetchWinners();
  }, [supabase]);

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );

  if (winners.length === 0) return null;

  const isSingle = winners.length === 1;

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950/50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            <Trophy size={14} />
            Hall of Fame
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase">
            Nuestros{" "}
            <span className="text-emerald-500 text-glow">Ganadores</span>
          </h2>
          <p className="max-w-xl mx-auto text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Ellos ya ganaron con el gocho. ¡Tú podrías ser el próximo!
          </p>
        </div>

        <div
          className={`relative ${isSingle ? "max-w-md mx-auto" : "w-full"} group/carousel`}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={isSingle}
            loop={!isSingle}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            breakpoints={{
              640: { slidesPerView: isSingle ? 1 : 2 },
              1024: { slidesPerView: isSingle ? 1 : 3 },
            }}
            className="pb-16 !overflow-visible"
          >
            {winners.map((winner) => (
              <SwiperSlide key={winner.id}>
                <div className="group relative bg-zinc-900 border border-zinc-800 rounded-4xl p-5 mb-4 transition-all duration-700 hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] h-full">
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-4xl"></div>

                  <div className="relative space-y-5">
                    {/* Winner Image Container - Smaller as requested */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                      {winner.imagen_url ? (
                        <Image
                          src={winner.imagen_url}
                          alt={winner.nombre}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-4xl opacity-20">
                          🏆
                        </div>
                      )}

                      {/* Badge on Image */}
                      <div className="absolute top-3 left-3">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Star
                            className="text-emerald-500 fill-emerald-500"
                            size={10}
                          />
                          <span className="text-[8px] font-black text-white uppercase tracking-wider">
                            Verificado
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-center">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">
                          {winner.nombre}
                        </h3>
                        <div className="flex items-center justify-center gap-4 text-zinc-500 text-[9px] font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={10} className="text-emerald-500" />
                            {new Date(
                              winner.fecha + "T12:00:00",
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={10} className="text-emerald-500" />
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

                      <div className="bg-zinc-950/50 rounded-2xl p-3 border border-zinc-800/50 backdrop-blur-sm relative">
                        {winner.numero_boleto && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-lg shadow-emerald-500/20 uppercase tracking-tighter">
                            Ticket #{winner.numero_boleto}
                          </div>
                        )}
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">
                          Premio Obtenido
                        </p>
                        <p className="text-xs font-bold text-emerald-500 line-clamp-1">
                          {winner.rifa_nombre}
                        </p>
                      </div>

                      {winner.descripcion && (
                        <p className="text-[10px] text-zinc-500 leading-relaxed italic line-clamp-2 px-2 border-x border-emerald-500/20">
                          "{winner.descripcion}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons - Only if more than 1 slide visible */}
          {!isSingle && (
            <>
              <button className="swiper-button-prev-custom absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 active:scale-90">
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-button-next-custom absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-800 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 active:scale-90">
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #3f3f46;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </section>
  );
}
