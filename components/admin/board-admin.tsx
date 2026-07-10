"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";

export function BoardAdminClient() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", sortOrder: 0, photoPath: "" });

  const load = () => { fetch("/api/board").then(r => r.json()).then(d => setList(d ?? [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ name: "", title: "", sortOrder: 0, photoPath: "" }); setEditing(null); setShowForm(false); };

  const openEdit = (item: any) => {
    setForm({ name: item?.name ?? "", title: item?.title ?? "", sortOrder: item?.sortOrder ?? 0, photoPath: item?.photoPath ?? "" });
    setEditing(item); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form?.name || !form?.title) { toast.error("İsim ve unvan gerekli"); return; }
    try {
      const url = editing ? `/api/board/${editing.id}` : "/api/board";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res?.ok) { toast.success(editing ? "Güncellendi" : "Eklendi"); reset(); load(); } else { toast.error("Kaydedilemedi"); }
    } catch { toast.error("Hata"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try { const res = await fetch(`/api/board/${id}`, { method: "DELETE" }); if (res?.ok) { toast.success("Silindi"); load(); } } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Yönetim Kurulu</h1>
        <button onClick={() => { reset(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold"><Plus size={18} /> Yeni Üye</button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Düzenle" : "Yeni Üye"}</h2>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">İsim *</label><input type="text" value={form?.name ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), name: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Unvan/Görev *</label><input type="text" value={form?.title ?? ""} onChange={e => setForm(p => ({ ...(p ?? {}), title: e.target.value }))} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Sıra</label><input type="number" value={form?.sortOrder ?? 0} onChange={e => setForm(p => ({ ...(p ?? {}), sortOrder: parseInt(e.target.value) || 0 }))} className="w-32 px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Fotoğraf</label><FileUpload currentUrl={editing?.photoUrl} onUpload={(url) => setForm(p => ({ ...(p ?? {}), photoPath: url }))} onRemove={() => setForm(p => ({ ...(p ?? {}), photoPath: "" }))} label="Fotoğraf Yükle" /></div>
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
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><Users size={16} className="text-red-500 shrink-0" /><h3 className="font-semibold truncate">{item?.name ?? ""}</h3></div><p className="text-xs text-gray-500 mt-1">{item?.title ?? ""} • Sıra: {item?.sortOrder ?? 0}</p></div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item?.id)} className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {(list?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz üye yok.</p>}
      </div>
    </div>
  );
}
