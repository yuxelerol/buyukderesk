"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function NewsListClient() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => setNews(d ?? [])).catch(() => {});
  }, []);

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "d MMMM yyyy", { locale: tr }); } catch { return dateStr ?? ""; }
  };

  return (
    <div className="py-12">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Haberler & Duyurular</h1>
            <p className="text-gray-400 text-lg">Kulübümüzden en son haberler ve duyurular</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(news ?? []).map((item: any, i: number) => (
              <motion.div
                key={item?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/haberler/${item?.id}`} className="block group">
                  <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-900/10 transition-all border border-white/5 hover:border-red-900/30">
                    {item?.coverUrl ? (
                      <div className="relative aspect-video bg-gray-800">
                        <Image src={item.coverUrl} alt={item?.title ?? ""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-red-900/30 to-gray-900 flex items-center justify-center">
                        <Newspaper className="text-red-500/50" size={48} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs text-red-500 mb-2">{formatDate(item?.publishDate)}</p>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-red-500 transition-colors line-clamp-2">{item?.title ?? ""}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{item?.summary ?? ""}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {(news?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-12">Henüz haber eklenmemiş.</p>}
        </div>
      </section>
    </div>
  );
}
