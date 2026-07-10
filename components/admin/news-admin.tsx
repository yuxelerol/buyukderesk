"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function NewsAdminClient() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", summary: "", publishDate: "", coverPath: "", published: true });

  const loadNews = () => {
    fetch("/api/news/all").then(r => r.json()).then(d => setNewsList(d ?? [])).catch(() => {});
  };

  useEffect(() => { loadNews(); }, []);

  const resetForm = () => {
    setForm({ title: "", content: "", summary: "", publishDate: "", coverPath: "", published: true });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (item: any) => {
    setForm({
      title: item?.title ?? "",
      content: item?.content ?? "",
      summary: item?.summary ?? "",
      publishDate: item?.publishDate ? new Date(item.publishDate).toISOString().split("T")[0] : "",
      coverPath: item?.coverPath ?? "",
      published: item?.published ?? true,
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form?.title || !form?.content) { toast.error("Başlık ve içerik gerekli"); return; }
    const data = { ...form, publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : new Date().toISOString() };

    try {
      const url = editing ? `/api/news/${editing.id}` : "/api/news";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res?.ok) {
        toast.success(editing ? "Haber güncellendi" : "Haber eklendi");
        resetForm();
        loadNews();
      } else {
        toast.error("Kaydedilemedi");
      }
    } catch { toast.error("Hata oluştu"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (res?.ok) { toast.success("Haber silindi"); loadNews(); } else { toast.error("Silinemedi"); }
    } catch { toast.error("Hata oluştu"); }
  };

  const formatDate = (d: string) => { try { return format(new Date(d), "d MMM yyyy", { locale: tr }); } catch { return d ?? ""; } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Haberler</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={18} /> Yeni Haber
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Haberi Düzenle" : "Yeni Haber"}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Başlık *</label>
              <input type="text" value={form?.title ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), title: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kısa Açıklama</label>
              <input type="text" value={form?.summary ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), summary: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">İçerik *</label>
              <textarea value={form?.content ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), content: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none min-h-[150px] resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Yayın Tarihi</label>
              <input type="date" value={form?.publishDate ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), publishDate: e.target.value }))} className="px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Kapak Fotoğrafı</label>
              <FileUpload
                currentUrl={editing?.coverUrl}
                onUpload={(url) => setForm(p => ({ ...(p ?? {}), coverPath: url }))}
                onRemove={() => setForm(p => ({ ...(p ?? {}), coverPath: "" }))}
                label="Kapak Fotoğrafı Yükle"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form?.published ?? true} onChange={e => setForm(p => ({ ...(p ?? {}), published: e.target.checked }))} className="rounded" id="published" />
              <label htmlFor="published" className="text-sm text-gray-300">Yayınla</label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors">Kaydet</button>
              <button onClick={resetForm} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">İptal</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(newsList ?? []).map((item: any) => (
          <div key={item?.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Newspaper size={16} className="text-red-500 shrink-0" />
                <h3 className="font-semibold truncate">{item?.title ?? ""}</h3>
                {!item?.published && <span className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded">Taslak</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatDate(item?.publishDate)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item?.id)} className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {(newsList?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz haber yok.</p>}
      </div>
    </div>
  );
}
