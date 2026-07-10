"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function NewsDetailClient({ id }: { id: string }) {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/news/${id}`)
      .then(r => r.json())
      .then(d => setNews(d ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-32 text-center text-gray-500">Yükleniyor...</div>;
  if (!news) return <div className="py-32 text-center text-gray-500">Haber bulunamadı.</div>;

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "d MMMM yyyy", { locale: tr }); } catch { return dateStr ?? ""; }
  };

  return (
    <div className="py-12">
      <div className="max-w-[800px] mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/haberler" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 mb-8 text-sm font-semibold">
            <ArrowLeft size={16} /> Haberlere Dön
          </Link>

          {news?.coverUrl && (
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-8">
              <Image src={news.coverUrl} alt={news?.title ?? ""} fill className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
            <Calendar size={14} />
            {formatDate(news?.publishDate)}
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">{news?.title ?? ""}</h1>

          <div className="prose prose-invert prose-red max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{news?.content ?? ""}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
