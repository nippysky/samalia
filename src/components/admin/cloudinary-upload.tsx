// src/components/admin/cloudinary-upload.tsx
// Cloudinary direct upload widget — pure white/black, straight edges

"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ── Single image upload ───────────────────────────────────────────

export type CloudinaryImageValue = {
  publicId: string;
  src: string;
  alt: string;
};

type CloudinaryUploadProps = {
  value?: CloudinaryImageValue | null;
  onChange: (result: CloudinaryImageValue | null) => void;
  folder?: string;
  label?: string;
  aspectHint?: string;
  disabled?: boolean;
};

async function uploadToCloudinary(file: File, folder: string): Promise<CloudinaryImageValue> {
  const timestamp = Math.round(Date.now() / 1000);
  const sigRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, timestamp }),
  });
  const { signature, apiKey, cloudName } = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);
  formData.append("quality", "auto:best");
  formData.append("fetch_format", "auto");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  return {
    publicId: data.public_id,
    src: data.secure_url,
    alt: file.name.replace(/\.[^.]+$/, ""),
  };
}

export function CloudinaryUpload({
  value,
  onChange,
  folder = "samalia",
  label,
  aspectHint,
  disabled,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, folder);
      onChange(result);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
          {label}
        </label>
      )}

      {value?.src ? (
        /* ── Image preview ── */
        <div className="relative group">
          <div className="relative bg-gray-100 border border-gray-100 overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={value.src}
              alt={value.alt || "Uploaded image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
          {/* Hover controls */}
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => !disabled && fileInputRef.current?.click()}
              disabled={disabled ?? uploading}
              className="bg-white border border-gray-200 text-gray-600 p-1.5 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
              title="Replace image"
            >
              <Upload size={12} />
            </button>
            <button
              type="button"
              onClick={() => !disabled && onChange(null)}
              disabled={disabled}
              className="bg-white border border-gray-200 text-gray-600 p-1.5 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
          {aspectHint && <p className="text-gray-300 text-[10px] mt-1">{aspectHint}</p>}
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) handleFile(file); }}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors min-h-[140px] p-6",
            dragOver
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50",
            (disabled ?? uploading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-gray-400 animate-spin" />
              <p className="text-gray-400 text-[12px] tracking-wide">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-9 h-9 bg-gray-100 border border-gray-200 flex items-center justify-center">
                <ImageIcon size={16} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-[12px]">
                  Drop image here or{" "}
                  <span className="text-gray-900 underline underline-offset-2">click to browse</span>
                </p>
                {aspectHint && (
                  <p className="text-gray-300 text-[11px] mt-1">{aspectHint}</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }}
        className="hidden"
      />
    </div>
  );
}

// ── Multi-image upload grid ───────────────────────────────────────

type MultiCloudinaryUploadProps = {
  values: CloudinaryImageValue[];
  onChange: (values: CloudinaryImageValue[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
};

export function MultiCloudinaryUpload({
  values,
  onChange,
  folder = "samalia",
  label = "Images",
  maxImages = 10,
}: MultiCloudinaryUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      const uploads = Array.from(files).slice(0, maxImages - values.length);
      const results = await Promise.all(uploads.map((f) => uploadToCloudinary(f, folder)));
      onChange([...values, ...results.filter(Boolean)]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {values.map((img, i) => (
          <div key={img.publicId || i} className="relative group aspect-square bg-gray-100 border border-gray-100">
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-white border border-gray-200 text-gray-600 p-1 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
            >
              <X size={11} />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 font-medium">
              {i + 1}
            </div>
          </div>
        ))}
        {values.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-700 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Upload size={16} />
                <span className="text-[10px] tracking-wide uppercase">Add</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="text-gray-300 text-[11px]">{values.length} / {maxImages} images</p>
    </div>
  );
}
