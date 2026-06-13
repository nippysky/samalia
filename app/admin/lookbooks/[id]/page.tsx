// app/admin/lookbooks/[id]/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  AdminSelect,
  AdminPageLoader,
  AdminFormActions,
  ConfirmDialog,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import {
  getLookbooks,
  updateLookbook,
  addLookbookLook,
  deleteLookbookLook,
  toggleLookbookPublished,
  addGalleryImage,
  deleteGalleryImage,
} from "@/src/actions/lookbooks";
import type { Lookbook, LookbookLook, LookbookGalleryImage } from "@/src/generated/prisma/client";

type LookbookFull = Lookbook & { looks: LookbookLook[]; gallery: LookbookGalleryImage[] };

const POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

// ── Add Look form ─────────────────────────────────────────────────

function AddLookForm({ onAdd, onCancel }: { onAdd: (data: unknown) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = React.useState({
    lookNumber: "",
    title: "",
    category: "",
    description: "",
    imagePublicId: "",
    imageSrc: "",
    imageAlt: "",
    imagePosition: "center",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageSrc) { setError("Image required"); return; }
    setSaving(true);
    try { await onAdd(form); } catch { setError("Failed to add look"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">New Look</p>
      <CloudinaryUpload
        label="Look Image *"
        value={form.imageSrc ? { publicId: form.imagePublicId, src: form.imageSrc, alt: form.imageAlt } : null}
        onChange={(v) => setForm({ ...form, imagePublicId: v?.publicId ?? "", imageSrc: v?.src ?? "", imageAlt: v?.alt ?? "" })}
        folder="lookbooks/looks"
      />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Look #" value={form.lookNumber} onChange={(e) => setForm({ ...form, lookNumber: e.target.value })} placeholder="01" />
        <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <AdminInput label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Formal" />
        <AdminSelect label="Image Position" value={form.imagePosition} onChange={(e) => setForm({ ...form, imagePosition: e.target.value })} options={POSITION_OPTIONS} />
      </div>
      <AdminTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
      {error && <p className="text-red-500 text-[11px]">{error}</p>}
      <div className="flex gap-2">
        <AdminButton type="submit" size="sm" loading={saving}>Add Look</AdminButton>
        <AdminButton type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</AdminButton>
      </div>
    </form>
  );
}

// ── Add Gallery Photo inline form ─────────────────────────────────

function AddGalleryPhotoForm({ onAdd, onCancel }: { onAdd: (data: unknown) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = React.useState({
    imagePublicId: "",
    imageSrc: "",
    imageAlt: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageSrc) { setError("Photo required"); return; }
    setSaving(true);
    try { await onAdd(form); } catch { setError("Failed to add photo"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 border border-dashed border-gray-200 bg-gray-50 space-y-3">
      <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em]">Upload Photo</p>
      <CloudinaryUpload
        label="Photo *"
        value={form.imageSrc ? { publicId: form.imagePublicId, src: form.imageSrc, alt: form.imageAlt } : null}
        onChange={(v) => setForm({ ...form, imagePublicId: v?.publicId ?? "", imageSrc: v?.src ?? "", imageAlt: v?.alt ?? "" })}
        folder="lookbooks/gallery"
      />
      {error && <p className="text-red-500 text-[11px]">{error}</p>}
      <div className="flex gap-2">
        <AdminButton type="submit" size="sm" loading={saving}>Add Photo</AdminButton>
        <AdminButton type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</AdminButton>
      </div>
    </form>
  );
}

// ── Main edit page ────────────────────────────────────────────────

export default function EditLookbookPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lookbook, setLookbook] = React.useState<LookbookFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showAddLook, setShowAddLook] = React.useState(false);
  const [showAddPhoto, setShowAddPhoto] = React.useState(false);
  const [deleteLookId, setDeleteLookId] = React.useState<string | null>(null);
  const [deletePhotoId, setDeletePhotoId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState<Record<string, unknown>>({});

  async function load() {
    const all = await getLookbooks();
    const lb = all.find((l: any) => l.id === params.id) as LookbookFull | undefined;
    if (lb) {
      setLookbook(lb);
      setForm({
        title: lb.title,
        slug: lb.slug,
        subtitle: lb.subtitle ?? "",
        season: lb.season ?? "",
        description: lb.description ?? "",
        isPublished: lb.isPublished,
        coverImagePublicId: lb.coverImagePublicId ?? "",
        coverImageSrc: lb.coverImageSrc ?? "",
        coverImageAlt: lb.coverImageAlt ?? "",
        heroImagePublicId: lb.heroImagePublicId ?? "",
        heroImageSrc: lb.heroImageSrc ?? "",
        heroImageAlt: lb.heroImageAlt ?? "",
      });
    }
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!lookbook) return;
    setSaving(true);
    setError("");
    try {
      const result = await updateLookbook(lookbook.id, form);
      if (result && "error" in result) { setError("Validation failed"); return; }
      await load();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddLook(data: unknown) {
    if (!lookbook) return;
    await addLookbookLook(lookbook.id, data);
    setShowAddLook(false);
    await load();
  }

  async function handleAddPhoto(data: unknown) {
    if (!lookbook) return;
    await addGalleryImage(
      lookbook.id,
      data as { imagePublicId: string; imageSrc: string; imageAlt: string }
    );
    setShowAddPhoto(false);
    await load();
  }

  async function handleDeleteLook() {
    if (!deleteLookId) return;
    await deleteLookbookLook(deleteLookId);
    setDeleteLookId(null);
    await load();
  }

  async function handleDeletePhoto() {
    if (!deletePhotoId) return;
    await deleteGalleryImage(deletePhotoId);
    setDeletePhotoId(null);
    await load();
  }

  if (loading || !lookbook) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title={lookbook.title}
      subtitle="Edit lookbook"
      actions={
        <div className="flex gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={async () => { await toggleLookbookPublished(lookbook.id, !lookbook.isPublished); await load(); }}
          >
            {lookbook.isPublished ? "Unpublish" : "Publish"}
          </AdminButton>
          <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/lookbooks")}>
            ← Back
          </AdminButton>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-6xl">

        {/* Left: details + images */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSave} className="space-y-5">
            <AdminCard title="Details">
              <div className="space-y-3">
                <AdminInput label="Title" value={form.title as string} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <AdminInput label="Slug" value={form.slug as string} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                <AdminInput label="Subtitle" value={form.subtitle as string} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                <AdminInput label="Season" value={form.season as string} onChange={(e) => setForm({ ...form, season: e.target.value })} />
                <AdminTextarea label="Description" value={form.description as string} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                <AdminToggle
                  label="Published"
                  description="Visible on the website"
                  checked={form.isPublished as boolean}
                  onChange={(v) => setForm({ ...form, isPublished: v })}
                />
              </div>
            </AdminCard>

            <AdminCard title="Cover Image">
              <CloudinaryUpload
                label="Cover"
                value={(form.coverImageSrc as string) ? { publicId: form.coverImagePublicId as string, src: form.coverImageSrc as string, alt: form.coverImageAlt as string } : null}
                onChange={(v) => setForm({ ...form, coverImagePublicId: v?.publicId ?? "", coverImageSrc: v?.src ?? "", coverImageAlt: v?.alt ?? "" })}
                folder="lookbooks"
              />
            </AdminCard>

            <AdminCard title="Hero Image">
              <CloudinaryUpload
                label="Hero"
                value={(form.heroImageSrc as string) ? { publicId: form.heroImagePublicId as string, src: form.heroImageSrc as string, alt: form.heroImageAlt as string } : null}
                onChange={(v) => setForm({ ...form, heroImagePublicId: v?.publicId ?? "", heroImageSrc: v?.src ?? "", heroImageAlt: v?.alt ?? "" })}
                folder="lookbooks"
              />
            </AdminCard>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <AdminFormActions>
              <AdminButton type="submit" loading={saving}>Save Changes</AdminButton>
              <AdminButton variant="ghost" type="button" onClick={() => router.push("/admin/lookbooks")}>Cancel</AdminButton>
            </AdminFormActions>
          </form>
        </div>

        {/* Right: looks + gallery */}
        <div className="lg:col-span-3 space-y-5">

          {/* Looks */}
          <AdminCard
            title={`Looks (${lookbook.looks.length})`}
            actions={
              !showAddLook ? (
                <AdminButton size="sm" variant="secondary" iconBefore={<Plus size={12} />} onClick={() => setShowAddLook(true)}>
                  Add Look
                </AdminButton>
              ) : undefined
            }
          >
            <div className="space-y-2">
              {lookbook.looks.map((look: any) => (
                <div key={look.id} className="flex gap-3 items-center p-2.5 bg-gray-50 border border-gray-100">
                  {look.imageSrc ? (
                    <img src={look.imageSrc} alt={look.imageAlt} className="w-12 h-14 object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-14 bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-[13px] font-medium">
                      {look.lookNumber ? `Look ${look.lookNumber}` : ""}{look.title ? ` — ${look.title}` : ""}
                    </p>
                    {look.category && <p className="text-gray-400 text-[11px]">{look.category}</p>}
                  </div>
                  <button
                    onClick={() => setDeleteLookId(look.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {lookbook.looks.length === 0 && (
                <p className="text-gray-400 text-[12px] py-6 text-center">No looks yet</p>
              )}
            </div>
            {showAddLook && (
              <AddLookForm onAdd={handleAddLook} onCancel={() => setShowAddLook(false)} />
            )}
          </AdminCard>

          {/* Gallery — unlimited dynamic photos */}
          <AdminCard title={`Gallery (${lookbook.gallery.length} photos)`}>
            {lookbook.gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {lookbook.gallery.map((photo: any) => (
                  <div key={photo.id} className="relative group aspect-square overflow-hidden">
                    <img
                      src={photo.imageSrc}
                      alt={photo.imageAlt ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setDeletePhotoId(photo.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Always-visible add-photo CTA */}
            {showAddPhoto ? (
              <AddGalleryPhotoForm onAdd={handleAddPhoto} onCancel={() => setShowAddPhoto(false)} />
            ) : (
              <button
                type="button"
                onClick={() => setShowAddPhoto(true)}
                className="w-full flex items-center justify-center gap-2 py-5 border border-dashed border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors text-[12px] tracking-[0.1em] uppercase"
              >
                <Plus size={14} />
                Add Photo
              </button>
            )}
          </AdminCard>

        </div>
      </div>

      <ConfirmDialog
        open={!!deleteLookId}
        title="Remove Look"
        message="This will permanently remove this look from the collection."
        confirmLabel="Remove"
        onConfirm={handleDeleteLook}
        onCancel={() => setDeleteLookId(null)}
        danger
      />

      <ConfirmDialog
        open={!!deletePhotoId}
        title="Remove Photo"
        message="This photo will be permanently removed from the gallery."
        confirmLabel="Remove"
        onConfirm={handleDeletePhoto}
        onCancel={() => setDeletePhotoId(null)}
        danger
      />
    </AdminPageShell>
  );
}
