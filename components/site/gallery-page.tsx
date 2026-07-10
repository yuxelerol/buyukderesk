"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryClient() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery/photos").then(r => r.json()).then(d => setPhotos(d ?? [])).catch(() => {});
  }, []);

  const openLightbox = (index: number) => setSelected(index);
  const closeLightbox = () => setSelected(null);
  const goPrev = () => setSelected(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
  const goNext = () => setSelected(prev => (prev !== null && prev < (photos?.length ?? 0) - 1 ? prev + 1 : prev));

  return (
    <div className="py-12">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Foto Galeri</h1>
            <p className="text-gray-400 text-lg">Kulübümüzden kareler</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(photos ?? []).map((p: any, i: number) => (
              <motion.div
                key={p?.id ?? i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(i)}
              >
                {p?.imageUrl ? (
                  <Image src={p.imageUrl} alt={p?.caption ?? "Fotoğraf"} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="text-gray-600" size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  {p?.caption && (
                    <p className="p-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {(photos?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-12">Henüz fotoğraf eklenmemiş.</p>}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && photos?.[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 text-white hover:text-red-500 z-10">
              <X size={32} />
            </button>
            {selected > 0 && (
              <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 text-white hover:text-red-500 z-10">
                <ChevronLeft size={40} />
              </button>
            )}
            {selected < (photos?.length ?? 0) - 1 && (
              <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 text-white hover:text-red-500 z-10">
                <ChevronRight size={40} />
              </button>
            )}
            <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image
                src={photos[selected]?.imageUrl ?? ""}
                alt={photos[selected]?.caption ?? "Fotoğraf"}
                fill
                className="object-contain"
              />
            </div>
            {photos[selected]?.caption && (
              <p className="absolute bottom-8 text-white text-center text-sm">{photos[selected].caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
