"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function ActivitiesAdminClient() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", activityDate: "", imagePath: "" });

  const load = () => { fetch("/api/activities").then(r => r.json()).then(d => setList(d ?? [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ title: "", description: "", activityDate: "", imagePath: "" }); setEditing(null); setShowForm(false); };

  const openEdit = (item: any) => {
    setForm({ title: item?.title ?? "", description: item?.description ?? "", activityDate: item?.activityDate ? new Date(item.activityDate).toISOString().split("T")[0] : "", imagePath: item?.imagePath ?? "" });
    setEditing(item); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form?.title) { toast.error("Başlık gerekli"); return; }
    const data = { ...form, activityDate: form.activityDate ? new Date(form.activityDate).toISOString() : new Date().toISOString() };
    try {
      const url = editing ? `/api/activities/${editing.id}` : "/api/activities";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res?.ok) { toast.success(editing ? "Güncellendi" : "Eklendi"); reset(); load(); } else { toast.error("Kaydedilemedi"); }
    } catch { toast.error("Hata"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try { const res = await fetch(`/api/activities/${id}`, { method: "DELETE" }); if (res?.ok) { toast.success("Silindi"); load(); } } catch {}
  };

  const formatDate = (d: string) => { try { return format(new Date(d), "d MMM yyyy", { locale: tr }); } catch { return d ?? ""; } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Faaliyetler</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"><Plus size={18} /> Yeni Faaliyet</button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Düzenle" : "Yeni Faaliyet"}</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Başlık *</label><input type="text" value={form?.title ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), title: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label><textarea value={form?.description ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), description: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none min-h-[100px] resize-y" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Tarih</label><input type="date" value={form?.activityDate ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), activityDate: e.target.value }))} className="px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Fotoğraf</label><FileUpload currentUrl={editing?.imageUrl} onUpload={(url) => setForm(p => ({ ...(p ?? {}), imagePath: url }))} onRemove={() => setForm(p => ({ ...(p ?? {}), imagePath: "" }))} label="Fotoğraf Yükle" /></div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold">Kaydet</button>
              <button onClick={reset} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold">İptal</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(list ?? []).map((item: any) => (
          <div key={item?.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><Calendar size={16} className="text-red-500 shrink-0" /><h3 className="font-semibold truncate">{item?.title ?? ""}</h3></div><p className="text-xs text-gray-500 mt-1">{formatDate(item?.activityDate)}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item?.id)} className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {(list?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz faaliyet yok.</p>}
      </div>
    </div>
  );
}
