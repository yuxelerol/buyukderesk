"use client";

import { useState } from "react";
import { Lock, Save } from "lucide-react";
import { toast } from "sonner";

export function PasswordChangeClient() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.currentPassword || !form?.newPassword) {
      toast.error("Tüm alanları doldurun");
      return;
    }
    if (form?.newPassword !== form?.confirmPassword) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    if ((form?.newPassword?.length ?? 0) < 6) {
      toast.error("Şifre en az 6 karakter olmalı");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });

      const data = await res.json();
      if (res?.ok) {
        toast.success("Şifre başarıyla değiştirildi");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data?.error ?? "Şifre değiştirilemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Şifre Değiştir</h1>

      <div className="max-w-md">
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mevcut Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={form?.currentPassword ?? ""}
                  onChange={e => setForm(p => ({ ...(p ?? {}), currentPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={form?.newPassword ?? ""}
                  onChange={e => setForm(p => ({ ...(p ?? {}), newPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={form?.confirmPassword ?? ""}
                  onChange={e => setForm(p => ({ ...(p ?? {}), confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
            >
              <Save size={18} />
              {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
