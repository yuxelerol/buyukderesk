"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

export function VideosAdminClient() {
  const [videos, setVideos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "" });

  const load = () => { fetch("/api/gallery/videos").then(r => r.json()).then(d => setVideos(d ?? [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form?.title || !form?.videoUrl) { toast.error("Başlık ve URL gerekli"); return; }
    try {
      const res = await fetch("/api/gallery/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res?.ok) { toast.success("Video eklendi"); setForm({ title: "", description: "", videoUrl: "" }); setShowForm(false); load(); } else { toast.error("Eklenemedi"); }
    } catch { toast.error("Hata"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try { const res = await fetch(`/api/gallery/videos/${id}`, { method: "DELETE" }); if (res?.ok) { toast.success("Silindi"); load(); } } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Video Galeri</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"><Plus size={18} /> Yeni Video</button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Video</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Başlık *</label><input type="text" value={form?.title ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), title: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Video URL (YouTube) *</label><input type="url" value={form?.videoUrl ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), videoUrl: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="https://www.youtube.com/watch?v=..." /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label><textarea value={form?.description ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), description: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none min-h-[80px] resize-y" /></div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold">Kaydet</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold">İptal</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(videos ?? []).map((v: any) => (
          <div key={v?.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><Video size={16} className="text-red-500 shrink-0" /><h3 className="font-semibold truncate">{v?.title ?? ""}</h3></div><p className="text-xs text-gray-500 mt-1 truncate">{v?.videoUrl ?? ""}</p></div>
            <button onClick={() => handleDelete(v?.id)} className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
        {(videos?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz video yok.</p>}
      </div>
    </div>
  );
}
