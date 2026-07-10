"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, User } from "lucide-react";

export function BoardClient() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/board").then(r => r.json()).then(d => setMembers(d ?? [])).catch(() => {});
  }, []);

  return (
    <div className="py-12">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Yönetim Kurulu</h1>
            <p className="text-gray-400 text-lg">Kulübümüzün yönetim kadrosu</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(members ?? []).map((m: any, i: number) => (
              <motion.div
                key={m?.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-red-900/30 transition-all hover:shadow-lg hover:shadow-red-900/10"
              >
                {m?.photoUrl ? (
                  <div className="relative aspect-[3/4] bg-gray-800">
                    <Image src={m.photoUrl} alt={m?.name ?? ""} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-gradient-to-br from-red-900/20 to-gray-900 flex items-center justify-center">
                    <User className="text-red-500/40" size={64} />
                  </div>
                )}
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-lg">{m?.name ?? ""}</h3>
                  <p className="text-red-500 text-sm mt-1">{m?.title ?? ""}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {(members?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-12">Henüz üye eklenmemiş.</p>}
        </div>
      </section>
    </div>
  );
}
