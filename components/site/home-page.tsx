"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Newspaper, Calendar, Users, ArrowRight, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  publishDate: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  activityDate: string;
  imageUrl: string | null;
}

interface Settings {
  clubName: string | null;
  slogan: string | null;
  logoUrl: string | null;
  aboutText: string | null;
  heroBackgroundUrl: string | null;
}

export function HomePageClient() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d ?? {})).catch(() => {});
    fetch("/api/news?limit=3").then(r => r.json()).then(d => setNews(d ?? [])).catch(() => {});
    fetch("/api/activities").then(r => r.json()).then(d => setActivities((d ?? []).slice(0, 3))).catch(() => {});
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMMM yyyy", { locale: tr });
    } catch {
      return dateStr ?? "";
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {settings?.heroBackgroundUrl ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={settings.heroBackgroundUrl}
                alt="Arka plan"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0000] to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(204,0,0,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(204,0,0,0.1),transparent_60%)]" />
          </>
        )}

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {settings?.logoUrl ? (
              <div className="relative w-28 h-28 mx-auto mb-6">
                <Image
                  src={settings.logoUrl}
                  alt={settings?.clubName ?? "Kulüp"}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-28 h-28 mx-auto mb-6 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-4xl font-display">
                EG
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
              {settings?.clubName ?? "Eskişehir Gücü"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              {settings?.slogan ?? "Gücümüz Birliğimizden Gelir"}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/haberler"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Newspaper size={18} /> Son Haberler
              </Link>
              <Link
                href="/iletisim"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/20"
              >
                İletişime Geç
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <Newspaper className="text-red-500" size={28} />
              <h2 className="text-3xl font-display font-bold tracking-tight">Son Haberler</h2>
            </div>
            <Link
              href="/haberler"
              className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-semibold"
            >
              Tümü <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(news ?? []).map((item, i) => (
              <motion.div
                key={item?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/haberler/${item?.id}`} className="block group">
                  <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-900/10 transition-all duration-300">
                    {item?.coverUrl ? (
                      <div className="relative aspect-video bg-gray-800">
                        <Image
                          src={item.coverUrl}
                          alt={item?.title ?? ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-red-900/30 to-gray-900 flex items-center justify-center">
                        <Newspaper className="text-red-500/50" size={48} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs text-red-500 mb-2">{formatDate(item?.publishDate)}</p>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                        {item?.title ?? ""}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{item?.summary ?? ""}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(news?.length ?? 0) === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">Henüz haber eklenmemiş.</p>
            )}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <Calendar className="text-red-500" size={28} />
              <h2 className="text-3xl font-display font-bold tracking-tight">Yaklaşan Faaliyetler</h2>
            </div>
            <Link
              href="/faaliyetler"
              className="text-red-500 hover:text-red-400 flex items-center gap-1 text-sm font-semibold"
            >
              Tümü <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(activities ?? []).map((act, i) => (
              <motion.div
                key={act?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/faaliyetler/${act?.id}`} className="block group">
                  <div className="bg-[#1a1a1a] rounded-lg p-6 hover:shadow-lg hover:shadow-red-900/10 transition-all duration-300 border border-white/5 hover:border-red-900/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                        <Calendar className="text-red-500" size={20} />
                      </div>
                      <p className="text-xs text-red-500 font-semibold">{formatDate(act?.activityDate)}</p>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-red-500 transition-colors">
                      {act?.title ?? ""}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3">{act?.description ?? ""}</p>
                    <div className="mt-4 flex items-center text-red-500 text-sm font-semibold">
                      Detaylar <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(activities?.length ?? 0) === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-8">Henüz faaliyet eklenmemiş.</p>
            )}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-20 bg-[#0f0f0f]">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-red-500" size={28} />
                <h2 className="text-3xl font-display font-bold tracking-tight">Kulübümüz Hakkında</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                {settings?.aboutText ??
                  "Eskişehir Gücü Futbol Kulübü, gençlere spor bilinci kazandırmak ve toplumu spor aracılığıyla bir araya getirmek amacıyla kurulmuştur."}
              </p>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                Daha Fazla <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-red-900/30 to-[#1a1a1a] flex items-center justify-center border border-white/5">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl font-display mx-auto mb-4">
                    EG
                  </div>
                  <p className="text-gray-500 text-sm">Eskişehir Gücü</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
