"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  Camera,
  Video,
  Settings,
  Lock,
  LogOut,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Gösterge Paneli" },
  { href: "/admin/haberler", icon: Newspaper, label: "Haberler" },
  { href: "/admin/faaliyetler", icon: Calendar, label: "Faaliyetler" },
  { href: "/admin/yonetim", icon: Users, label: "Yönetim Kurulu" },
  { href: "/admin/galeri", icon: Camera, label: "Foto Galeri" },
  { href: "/admin/videolar", icon: Video, label: "Video Galeri" },
  { href: "/admin/mesajlar", icon: MessageSquare, label: "Mesajlar" },
  { href: "/admin/ayarlar", icon: Settings, label: "Genel Ayarlar" },
  { href: "/admin/sifre", icon: Lock, label: "Şifre Değiştir" },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#111] border-r border-white/10 z-50 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xs">
              EG
            </div>
            <span className="font-display font-bold text-sm">Yönetim Paneli</span>
          </div>
        </div>

        <nav className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith?.(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-red-600/20 text-red-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-500 hover:bg-white/5 transition-colors w-full"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 h-14">
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="text-sm text-gray-500">
              Hoş geldiniz, <span className="text-white">{session?.user?.name ?? session?.user?.email ?? "Admin"}</span>
            </div>
            <Link href="/" className="text-xs text-gray-500 hover:text-red-500 transition-colors">
              Siteyi Görüntüle
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
