"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail as MailIcon, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function ContactClient() {
  const [settings, setSettings] = useState<any>({});
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d ?? {})).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.name || !form?.email || !form?.message) {
      toast.error("Lütfen gerekli alanları doldurun.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res?.ok) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.success("Mesajınız başarıyla gönderildi!");
      } else {
        toast.error("Mesaj gönderilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent" />
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">İletişim</h1>
            <p className="text-gray-400 text-lg">Bizimle iletişime geçin</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#1a1a1a] rounded-lg p-8 border border-white/5 mb-6">
                <h2 className="text-2xl font-display font-bold mb-6">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  {settings?.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-red-500 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-sm mb-1">Adres</p>
                        <p className="text-gray-400 text-sm">{settings.address}</p>
                      </div>
                    </div>
                  )}
                  {settings?.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="text-red-500 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-sm mb-1">Telefon</p>
                        <p className="text-gray-400 text-sm">{settings.phone}</p>
                      </div>
                    </div>
                  )}
                  {settings?.email && (
                    <div className="flex items-start gap-3">
                      <MailIcon className="text-red-500 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-sm mb-1">E-posta</p>
                        <p className="text-gray-400 text-sm">{settings.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {settings?.mapsEmbed && (
                <div className="rounded-lg overflow-hidden border border-white/5">
                  <iframe
                    src={settings.mapsEmbed}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Harita"
                  />
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#1a1a1a] rounded-lg p-8 border border-white/5">
                <h2 className="text-2xl font-display font-bold mb-6">Mesaj Gönder</h2>

                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    <p className="text-lg font-semibold mb-2">Mesajınız Gönderildi!</p>
                    <p className="text-gray-400 text-sm">En kısa sürede size dönüş yapacağız.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Yeni Mesaj
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Ad Soyad *</label>
                      <input
                        type="text"
                        value={form?.name ?? ""}
                        onChange={e => setForm(prev => ({ ...(prev ?? {}), name: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="Adınızı girin"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">E-posta *</label>
                      <input
                        type="email"
                        value={form?.email ?? ""}
                        onChange={e => setForm(prev => ({ ...(prev ?? {}), email: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="E-posta adresinizi girin"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Konu</label>
                      <input
                        type="text"
                        value={form?.subject ?? ""}
                        onChange={e => setForm(prev => ({ ...(prev ?? {}), subject: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                        placeholder="Mesaj konusu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Mesaj *</label>
                      <textarea
                        value={form?.message ?? ""}
                        onChange={e => setForm(prev => ({ ...(prev ?? {}), message: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors min-h-[120px] resize-y"
                        placeholder="Mesajınızı yazın"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Send size={18} />
                      {loading ? "Gönderiliyor..." : "Gönder"}
                    </button>
                    <p className="text-xs text-gray-600 mt-2">
                      Verileriniz güvenle saklanır ve üçüncü taraflarla paylaşılmaz.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
