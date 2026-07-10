"use client";

import { useState, useEffect } from "react";
import { Newspaper, Calendar, Users, Camera, Video, MessageSquare } from "lucide-react";
import Link from "next/link";

export function AdminDashboardClient() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/news/all").then(r => r.ok ? r.json() : []),
      fetch("/api/activities").then(r => r.json()).catch(() => []),
      fetch("/api/board").then(r => r.json()).catch(() => []),
      fetch("/api/gallery/photos").then(r => r.json()).catch(() => []),
      fetch("/api/gallery/videos").then(r => r.json()).catch(() => []),
      fetch("/api/contact").then(r => r.ok ? r.json() : []),
    ]).then(([news, activities, board, photos, videos, messages]) => {
      setStats({
        news: (news ?? [])?.length ?? 0,
        activities: (activities ?? [])?.length ?? 0,
        board: (board ?? [])?.length ?? 0,
        photos: (photos ?? [])?.length ?? 0,
        videos: (videos ?? [])?.length ?? 0,
        messages: (messages ?? [])?.length ?? 0,
        unreadMessages: (messages ?? [])?.filter?.((m: any) => !m?.isRead)?.length ?? 0,
      });
    });
  }, []);

  const cards = [
    { label: "Haberler", count: stats?.news ?? 0, icon: Newspaper, href: "/admin/haberler", color: "bg-red-600/20 text-red-500" },
    { label: "Faaliyetler", count: stats?.activities ?? 0, icon: Calendar, href: "/admin/faaliyetler", color: "bg-blue-600/20 text-blue-500" },
    { label: "Yönetim Kurulu", count: stats?.board ?? 0, icon: Users, href: "/admin/yonetim", color: "bg-green-600/20 text-green-500" },
    { label: "Fotoğraflar", count: stats?.photos ?? 0, icon: Camera, href: "/admin/galeri", color: "bg-purple-600/20 text-purple-500" },
    { label: "Videolar", count: stats?.videos ?? 0, icon: Video, href: "/admin/videolar", color: "bg-yellow-600/20 text-yellow-500" },
    { label: "Mesajlar", count: stats?.messages ?? 0, icon: MessageSquare, href: "/admin/mesajlar", color: "bg-orange-600/20 text-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Gösterge Paneli</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/5 hover:border-red-900/30 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold mt-1">{card.count}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                  <card.icon size={24} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(stats?.unreadMessages ?? 0) > 0 && (
        <div className="mt-6 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 text-sm">
            <strong>{stats.unreadMessages}</strong> okunmamış mesajınız var.
            <Link href="/admin/mesajlar" className="ml-2 underline hover:text-orange-300">Görüntüle</Link>
          </p>
        </div>
      )}
    </div>
  );
}
