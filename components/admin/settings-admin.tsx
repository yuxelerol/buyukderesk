"use client";

import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";

export function SettingsAdminClient() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setForm(d ?? {})).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res?.ok) {
        toast.success("Ayarlar kaydedildi");
      } else {
        toast.error("Kaydedilemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: any) => setForm((p: any) => ({ ...(p ?? {}), [key]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Genel Ayarlar</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-semibold transition-colors"
        >
          <Save size={18} />
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Club Info */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Kulüp Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kulüp Adı</label>
              <input type="text" value={form?.clubName ?? ""} onChange={e => update("clubName", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slogan</label>
              <input type="text" value={form?.slogan ?? ""} onChange={e => update("slogan", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Logo</label>
              <FileUpload
                currentUrl={form?.logoUrl}
                onUpload={(url) => { update("logoPath", url); }}
                onRemove={() => { update("logoPath", null); }}
                label="Logo Yükle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Ana Sayfa Arka Plan Görseli</label>
              <FileUpload
                currentUrl={form?.heroBackgroundUrl}
                onUpload={(url) => { update("heroBackground", url); }}
                onRemove={() => { update("heroBackground", null); }}
                label="Arka Plan Yükle"
              />
              <p className="text-xs text-gray-500 mt-1">Önerilen boyut: 1920x1080 piksel, yatay format</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">İletişim Bilgileri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Adres</label>
              <input type="text" value={form?.address ?? ""} onChange={e => update("address", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Telefon</label>
              <input type="text" value={form?.phone ?? ""} onChange={e => update("phone", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">E-posta</label>
              <input type="email" value={form?.email ?? ""} onChange={e => update("email", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Google Maps Embed Linki</label>
              <input type="text" value={form?.mapsEmbed ?? ""} onChange={e => update("mapsEmbed", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="https://i.ytimg.com/vi/Pi1_BFQcClQ/maxresdefault.jpg" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Sosyal Medya</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label><input type="url" value={form?.facebook ?? ""} onChange={e => update("facebook", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Twitter / X</label><input type="url" value={form?.twitter ?? ""} onChange={e => update("twitter", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label><input type="url" value={form?.instagram ?? ""} onChange={e => update("instagram", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">YouTube</label><input type="url" value={form?.youtube ?? ""} onChange={e => update("youtube", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Hakkımızda Sayfası</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amaç Metni</label>
              <textarea value={form?.aboutText ?? ""} onChange={e => update("aboutText", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none min-h-[120px] resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tarihçe Metni</label>
              <textarea value={form?.historyText ?? ""} onChange={e => update("historyText", e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none min-h-[120px] resize-y" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
