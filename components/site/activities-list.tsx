"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function ActivitiesListClient() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/activities").then(r => r.json()).then(d => setActivities(d ?? [])).catch(() => {});
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
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Faaliyetler</h1>
            <p className="text-gray-400 text-lg">Kulübümüzün etkinlik ve faaliyetleri</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activities ?? []).map((act: any, i: number) => (
              <motion.div
                key={act?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/faaliyetler/${act?.id}`} className="block group">
                  <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-900/10 transition-all border border-white/5 hover:border-red-900/30">
                    {act?.imageUrl ? (
                      <div className="relative aspect-video bg-gray-800">
                        <Image src={act.imageUrl} alt={act?.title ?? ""} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : null}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-red-500 text-xs font-semibold mb-3">
                        <Calendar size={14} />
                        {formatDate(act?.activityDate)}
                      </div>
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-red-500 transition-colors">{act?.title ?? ""}</h3>
                      <p className="text-sm text-gray-400 line-clamp-3">{act?.description ?? ""}</p>
                      <div className="mt-4 flex items-center text-red-500 text-sm font-semibold">
                        Detaylar <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {(activities?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-12">Henüz faaliyet eklenmemiş.</p>}
        </div>
      </section>
    </div>
  );
}
