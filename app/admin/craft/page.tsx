// app/admin/craft/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminPageLoader,
  AdminFormActions,
  ConfirmDialog,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload, MultiCloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import {
  getCraftContent,
  updateCraftContent,
  upsertCraftPrinciple,
  deleteCraftPrinciple,
  upsertCraftEditorialImage,
  deleteCraftEditorialImage,
} from "@/src/actions/craft";
import type { CraftContent, CraftEditorialImage, CraftPrinciple } from "@/src/generated/prisma/client";

type CraftFull = CraftContent & { editorialImages: CraftEditorialImage[]; principles: CraftPrinciple[] };

export default function CraftPage() {
  const [content, setContent] = React.useState<CraftFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState<Record<string, unknown>>({});
  const [deletePrincipleId, setDeletePrincipleId] = React.useState<string | null>(null);
  const [deleteImageId, setDeleteImageId] = React.useState<string | null>(null);

  // New principle form
  const [showAddPrinciple, setShowAddPrinciple] = React.useState(false);
  const [newPTitle, setNewPTitle] = React.useState("");
  const [newPBody, setNewPBody] = React.useState("");
  const [addingP, setAddingP] = React.useState(false);

  async function load() {
    setLoading(true);
    const c = await getCraftContent() as CraftFull;
    setContent(c);
    setForm({
      heroTitle: c.heroTitle,
      heroSubtitle: c.heroSubtitle ?? "",
      heroImagePublicId: c.heroImagePublicId ?? "",
      heroImageSrc: c.heroImageSrc ?? "",
      heroImageAlt: c.heroImageAlt ?? "",
      introHeading: c.introHeading ?? "",
      introBody: c.introBody ?? "",
      principlesHeading: c.principlesHeading ?? "",
    });
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setError("");
    try {
      await updateCraftContent(content.id, form as Parameters<typeof updateCraftContent>[1]);
      await load();
    } catch { setError("Failed to save"); } finally { setSaving(false); }
  }

  async function handleAddPrinciple() {
    if (!content || !newPTitle) return;
    setAddingP(true);
    await upsertCraftPrinciple(content.id, null, { title: newPTitle, body: newPBody });
    setNewPTitle(""); setNewPBody(""); setShowAddPrinciple(false);
    setAddingP(false);
    await load();
  }

  async function handleAddImage(images: { publicId: string; src: string; alt: string }[]) {
    if (!content) return;
    // Add any new images not already in content
    const existing = new Set(content.editorialImages.map((i: any) => i.imageSrc as string));
    for (const img of images) {
      if (!existing.has(img.src)) {
        await upsertCraftEditorialImage(content.id, null, {
          imagePublicId: img.publicId,
          imageSrc: img.src,
          imageAlt: img.alt,
        });
      }
    }
    // Removed images
    for (const existing_img of content.editorialImages) {
      if (!images.find((i: any) => i.src === (existing_img as any).imageSrc)) {
        await deleteCraftEditorialImage(existing_img.id);
      }
    }
    await load();
  }

  if (loading || !content) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="Craft & Legacy"
      subtitle="Page editor"
    >
      <div className="max-w-4xl space-y-6">
        <form onSubmit={handleSave}>
          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Hero</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Page Title" value={form.heroTitle as string} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
                <AdminInput label="Subtitle" value={form.heroSubtitle as string} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
              </div>
              <CloudinaryUpload
                label="Hero Image"
                value={(form.heroImageSrc as string) ? { publicId: form.heroImagePublicId as string, src: form.heroImageSrc as string, alt: form.heroImageAlt as string } : null}
                onChange={(v) => setForm({ ...form, heroImagePublicId: v?.publicId ?? "", heroImageSrc: v?.src ?? "", heroImageAlt: v?.alt ?? "" })}
                folder="craft"
              />
            </div>
          </AdminCard>

          <AdminCard className="mt-5">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Introduction</h3>
            <div className="space-y-3">
              <AdminInput label="Heading" value={form.introHeading as string} onChange={(e) => setForm({ ...form, introHeading: e.target.value })} />
              <AdminTextarea label="Body" value={form.introBody as string} onChange={(e) => setForm({ ...form, introBody: e.target.value })} rows={4} />
            </div>
          </AdminCard>

          <AdminCard className="mt-5">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Principles Section</h3>
            <AdminInput label="Section Heading" value={form.principlesHeading as string} onChange={(e) => setForm({ ...form, principlesHeading: e.target.value })} />
          </AdminCard>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <AdminFormActions>
            <AdminButton type="submit" loading={saving}>Save Content</AdminButton>
          </AdminFormActions>
        </form>

        {/* Editorial Images */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Editorial Images</h3>
          <MultiCloudinaryUpload
            label="Editorial photography"
            values={content.editorialImages.map((i: any) => ({ publicId: i.imagePublicId as string, src: i.imageSrc as string, alt: i.imageAlt as string }))}
            onChange={handleAddImage}
            folder="craft"
            maxImages={12}
          />
        </AdminCard>

        {/* Principles */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">
              Principles ({content.principles.length})
            </h3>
            {!showAddPrinciple && (
              <AdminButton size="sm" variant="ghost" onClick={() => setShowAddPrinciple(true)}>+ Add</AdminButton>
            )}
          </div>
          <div className="space-y-3">
            {content.principles.map((p: any) => (
              <div key={p.id} className="p-3 bg-gray-50 border border-gray-100 flex gap-3 items-start group">
                <div className="flex-1">
                  <p className="text-gray-800 text-sm font-medium">{p.title}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.body}</p>
                </div>
                <AdminButton variant="danger" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setDeletePrincipleId(p.id)}>×</AdminButton>
              </div>
            ))}
          </div>
          {showAddPrinciple && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-gray-500 text-xs uppercase tracking-wider">New Principle</h4>
              <AdminInput label="Title" value={newPTitle} onChange={(e) => setNewPTitle(e.target.value)} />
              <AdminTextarea label="Body" value={newPBody} onChange={(e) => setNewPBody(e.target.value)} rows={3} />
              <div className="flex gap-2">
                <AdminButton size="sm" loading={addingP} onClick={handleAddPrinciple}>Add</AdminButton>
                <AdminButton size="sm" variant="ghost" onClick={() => setShowAddPrinciple(false)}>Cancel</AdminButton>
              </div>
            </div>
          )}
        </AdminCard>
      </div>

      <ConfirmDialog
        open={!!deletePrincipleId}
        title="Remove Principle"
        message="This principle will be permanently removed."
        confirmLabel="Remove"
        onConfirm={async () => { if (deletePrincipleId) { await deleteCraftPrinciple(deletePrincipleId); setDeletePrincipleId(null); await load(); } }}
        onCancel={() => setDeletePrincipleId(null)}
        danger
      />
    </AdminPageShell>
  );
}
