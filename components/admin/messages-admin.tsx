"use client";

import { useState, useEffect } from "react";
import { Trash2, MessageSquare, Mail, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function MessagesAdminClient() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const load = () => { fetch("/api/contact").then(r => r.json()).then(d => setMessages(d ?? [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const markRead = async (msg: any) => {
    setSelected(msg);
    if (!msg?.isRead) {
      try { await fetch(`/api/contact/${msg.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: true }) }); load(); } catch {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try { const res = await fetch(`/api/contact/${id}`, { method: "DELETE" }); if (res?.ok) { toast.success("Silindi"); setSelected(null); load(); } } catch {}
  };

  const formatDate = (d: string) => { try { return format(new Date(d), "d MMM yyyy HH:mm", { locale: tr }); } catch { return d ?? ""; } };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Mesajlar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {(messages ?? []).map((m: any) => (
            <div key={m?.id} onClick={() => markRead(m)} className={`bg-[#1a1a1a] rounded-lg p-4 border cursor-pointer transition-all ${
              selected?.id === m?.id ? "border-red-500/50" : m?.isRead ? "border-white/5" : "border-yellow-500/30 bg-yellow-900/5"
            } hover:border-red-500/30`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className={m?.isRead ? "text-gray-500" : "text-yellow-500"} />
                  <span className="font-semibold text-sm">{m?.name ?? ""}</span>
                  {!m?.isRead && <span className="w-2 h-2 bg-yellow-500 rounded-full" />}
                </div>
                <span className="text-xs text-gray-500">{formatDate(m?.createdAt)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{m?.subject || "(Konu belirtilmemiş)"}</p>
            </div>
          ))}
          {(messages?.length ?? 0) === 0 && <p className="text-gray-500 text-center py-8">Henüz mesaj yok.</p>}
        </div>

        {selected && (
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Mesaj Detayı</h2>
              <button onClick={() => handleDelete(selected?.id)} className="p-2 hover:bg-red-600/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
            </div>
            <div className="space-y-3">
              <div><span className="text-xs text-gray-500">Gönderen:</span><p className="text-sm font-semibold">{selected?.name ?? ""}</p></div>
              <div><span className="text-xs text-gray-500">E-posta:</span><p className="text-sm flex items-center gap-1"><Mail size={14} className="text-red-500" />{selected?.email ?? ""}</p></div>
              <div><span className="text-xs text-gray-500">Konu:</span><p className="text-sm">{selected?.subject || "-"}</p></div>
              <div><span className="text-xs text-gray-500">Tarih:</span><p className="text-sm">{formatDate(selected?.createdAt)}</p></div>
              <div className="pt-3 border-t border-white/10"><span className="text-xs text-gray-500">Mesaj:</span><p className="text-sm text-gray-300 mt-1 whitespace-pre-line">{selected?.message ?? ""}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
