"use client";

import { useState, useEffect } from "react";
import { Trash2, Camera } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";
import Image from "next/image";

export function GalleryAdminClient() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [caption, setCaption] = useState("");

  const load = () => { fetch("/api/gallery/photos").then(r => r.json()).then(d => setPhotos(d ?? [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const handleUpload = async (url: string) => {
    try {
      const res = await fetch("/api/gallery/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath: url, caption }),
      });
      if (res?.ok) { toast.success("Fotoğraf eklendi"); setCaption(""); load(); } else { toast.error("Eklenemedi"); }
    } catch { toast.error("Hata"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try { const res = await fetch(`/api/gallery/photos/${id}`, { method: "DELETE" }); if (res?.ok) { toast.success("Silindi"); load(); } } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Foto Galeri</h1>

      <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10 mb-6">
        <h2 className="text-lg font-semibold mb-4">Yeni Fotoğraf Ekle</h2>
        <div className="space-y-3">
          <div><label className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label><input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none" placeholder="Fotoğraf açıklaması" /></div>
          <FileUpload onUpload={handleUpload} label="Fotoğraf Yükle" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {(photos ?? []).map((p: any) => (
          <div key={p?.id} className="relative group">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              {p?.imageUrl && <Image src={p.imageUrl} alt={p?.caption ?? ""} fill className="object-cover" />}
            </div>
            <button onClick={() => handleDelete(p?.id)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
            {p?.caption && <p className="text-xs text-gray-500 mt-1 truncate">{p.caption}</p>}
          </div>
        ))}
      </div>
      {(photos?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz fotoğraf yok.</p>}
    </div>
  );
}
