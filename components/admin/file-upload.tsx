"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface FileUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ currentUrl, onUpload, onRemove, accept = "image/*", label = "Dosya Yükle" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Dosya çok büyük (maks 100MB)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/presigned", {
        method: "POST",
        body: formData,
      });

      if (!res?.ok) throw new Error("Yükleme başarısız");

      const { url } = await res.json();

      // Set preview
      const reader = new FileReader();
      reader.onload = (ev) => setPreview((ev?.target?.result as string) ?? null);
      reader.readAsDataURL(file);

      onUpload(url);
      toast.success("Dosya yüklendi!");
    } catch (err: any) {
      toast.error(err?.message ?? "Yükleme hatası");
    } finally {
      setUploading(false);
      if (inputRef?.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10">
          <Image src={preview} alt="Önizleme" fill className="object-contain" />
          {onRemove && (
            <button
              onClick={() => {
                setPreview(null);
                onRemove();
              }}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <label className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg cursor-pointer hover:border-red-500/50 transition-colors">
        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        <span className="text-sm">{uploading ? "Yükleniyor..." : label}</span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
