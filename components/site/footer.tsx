"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

interface Settings {
  clubName?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youtube?: string | null;
}

export function SiteFooter() {
  const [s, setS] = useState<Settings>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: any) => setS(d ?? {}))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 text-gray-400">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-display font-bold text-lg mb-4">
              {s?.clubName ?? "Eskişehir Gücü"}
            </h3>
            <p className="text-sm leading-relaxed">
              Gücümüz birliğimizden gelir. Eskişehir&apos;in gücünü futbol sahasına taşıyoruz.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/hakkimizda" className="hover:text-red-500 transition-colors">Hakkımızda</Link>
              <Link href="/haberler" className="hover:text-red-500 transition-colors">Haberler</Link>
              <Link href="/iletisim" className="hover:text-red-500 transition-colors">İletişim</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <div className="flex flex-col gap-2 text-sm">
              {s?.address && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-500 shrink-0" />
                  <span>{s.address}</span>
                </div>
              )}
              {s?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-red-500 shrink-0" />
                  <span>{s.phone}</span>
                </div>
              )}
              {s?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-red-500 shrink-0" />
                  <span>{s.email}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              {s?.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {s?.twitter && (
                <a href={s.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {s?.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {s?.youtube && (
                <a href={s.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-500 transition-colors">
                  <Youtube size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} {s?.clubName ?? "Eskişehir Gücü Futbol Kulübü"}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
