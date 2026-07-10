"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url ?? "");
    let videoId = "";
    if (u?.hostname?.includes?.("youtube.com")) {
      videoId = u?.searchParams?.get?.("v") ?? "";
    } else if (u?.hostname?.includes?.("youtu.be")) {
      videoId = u?.pathname?.slice?.(1) ?? "";
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

export function VideoGalleryClient() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gallery/videos").then(r => r.json()).then(d => setVideos(d ?? [])).catch(() => {});
  }, []);

  return (
    <div className="py-12">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Video Galeri</h1>
            <p className="text-gray-400 text-lg">Kulübümüzden video içerikler</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(videos ?? []).map((v: any, i: number) => (
              <motion.div
                key={v?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5"
              >
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(v?.videoUrl ?? "") ?? ""}
                    title={v?.title ?? "Video"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg">{v?.title ?? ""}</h3>
                  {v?.description && <p className="text-sm text-gray-400 mt-2">{v.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          {(videos?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-12">Henüz video eklenmemiş.</p>}
        </div>
      </section>
    </div>
  );
}
