"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, History, Palette } from "lucide-react";

export function AboutClient() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d ?? {})).catch(() => {});
  }, []);

  return (
    <div className="py-12">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Hakkımızda
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              {settings?.clubName ?? "Eskişehir Gücü Futbol Kulübü"} hakkında bilgiler
            </p>
          </motion.div>
        </div>
      </section>

      {/* About / Mission */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <Info className="text-red-500" size={24} />
              <h2 className="text-2xl font-display font-bold">Amacımız</h2>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {settings?.aboutText ?? "Kulüp bilgileri yüklenemiyor..."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <History className="text-red-500" size={24} />
              <h2 className="text-2xl font-display font-bold">Tarihçe</h2>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {settings?.historyText ?? "Tarihçe bilgisi yüklenemiyor..."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-lg p-8 border border-white/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-red-500" size={24} />
              <h2 className="text-2xl font-display font-bold">Takım Renkleri</h2>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-black border-2 border-white/20" />
                <div>
                  <p className="font-semibold">Siyah</p>
                  <p className="text-sm text-gray-500">#0A0A0A</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-red-600" />
                <div>
                  <p className="font-semibold">Kırmızı</p>
                  <p className="text-sm text-gray-500">#CC0000</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
