// app/admin/house/page.tsx
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
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import { getHouseContent, updateHouseContent, upsertHouseSection, deleteHouseSection } from "@/src/actions/house";
import type { HouseContent, HouseSection } from "@/src/generated/prisma/client";

type HouseContentFull = HouseContent & { sections: HouseSection[] };

function SectionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HouseSection>;
  onSave: (data: unknown) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    body: initial?.body ?? "",
    imagePublicId: initial?.imagePublicId ?? "",
    imageSrc: initial?.imageSrc ?? "",
    imageAlt: initial?.imageAlt ?? "",
    imagePosition: initial?.imagePosition ?? "center",
  });
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-100 pt-4 mt-4">
      <h4 className="text-gray-500 text-xs uppercase tracking-wider">{initial?.id ? "Edit Section" : "New Section"}</h4>
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <AdminInput label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </div>
      <AdminTextarea label="Body *" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={4} required />
      <CloudinaryUpload
        label="Section Image"
        value={form.imageSrc ? { publicId: form.imagePublicId, src: form.imageSrc, alt: form.imageAlt } : null}
        onChange={(v) => setForm({ ...form, imagePublicId: v?.publicId ?? "", imageSrc: v?.src ?? "", imageAlt: v?.alt ?? "" })}
        folder="house"
      />
      <div className="flex gap-2">
        <AdminButton type="submit" size="sm" loading={saving}>{initial?.id ? "Save" : "Add Section"}</AdminButton>
        <AdminButton type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</AdminButton>
      </div>
    </form>
  );
}

export default function HousePage() {
  const [content, setContent] = React.useState<HouseContentFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<HouseSection | null>(null);
  const [deleteSectionId, setDeleteSectionId] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");
  const [heroForm, setHeroForm] = React.useState<Record<string, unknown>>({});

  async function load() {
    setLoading(true);
    const c = await getHouseContent() as HouseContentFull;
    setContent(c);
    setHeroForm({
      heroTitle: c.heroTitle,
      heroSubtitle: c.heroSubtitle ?? "",
      heroImagePublicId: c.heroImagePublicId ?? "",
      heroImageSrc: c.heroImageSrc ?? "",
      heroImageAlt: c.heroImageAlt ?? "",
      overviewTitle: c.overviewTitle ?? "",
      overviewBody: c.overviewBody ?? "",
    });
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleHeroSave(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setError("");
    try {
      await updateHouseContent(content.id, heroForm as Parameters<typeof updateHouseContent>[1]);
      await load();
    } catch { setError("Failed to save"); } finally { setSaving(false); }
  }

  async function handleSaveSection(data: unknown, sectionId?: string) {
    if (!content) return;
    await upsertHouseSection(content.id, sectionId ?? null, data as Parameters<typeof upsertHouseSection>[2]);
    setShowAddSection(false);
    setEditingSection(null);
    await load();
  }

  async function handleDeleteSection() {
    if (!deleteSectionId) return;
    await deleteHouseSection(deleteSectionId);
    setDeleteSectionId(null);
    await load();
  }

  if (loading || !content) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="The House"
      subtitle="Page editor"
    >
      <div className="max-w-4xl space-y-6">
        {/* Hero */}
        <form onSubmit={handleHeroSave}>
          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Hero Section</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Page Title" value={heroForm.heroTitle as string} onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })} />
                <AdminInput label="Subtitle" value={heroForm.heroSubtitle as string} onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })} />
              </div>
              <CloudinaryUpload
                label="Hero Image"
                value={(heroForm.heroImageSrc as string) ? { publicId: heroForm.heroImagePublicId as string, src: heroForm.heroImageSrc as string, alt: heroForm.heroImageAlt as string } : null}
                onChange={(v) => setHeroForm({ ...heroForm, heroImagePublicId: v?.publicId ?? "", heroImageSrc: v?.src ?? "", heroImageAlt: v?.alt ?? "" })}
                folder="house"
              />
            </div>
          </AdminCard>

          <AdminCard className="mt-5">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Overview</h3>
            <div className="space-y-3">
              <AdminInput label="Overview Heading" value={heroForm.overviewTitle as string} onChange={(e) => setHeroForm({ ...heroForm, overviewTitle: e.target.value })} />
              <AdminTextarea label="Overview Body" value={heroForm.overviewBody as string} onChange={(e) => setHeroForm({ ...heroForm, overviewBody: e.target.value })} rows={4} />
            </div>
          </AdminCard>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <AdminFormActions>
            <AdminButton type="submit" loading={saving}>Save Hero & Overview</AdminButton>
          </AdminFormActions>
        </form>

        {/* Sections */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">
              Content Sections ({content.sections.length})
            </h3>
            {!showAddSection && !editingSection && (
              <AdminButton size="sm" variant="ghost" onClick={() => setShowAddSection(true)}>
                + Add Section
              </AdminButton>
            )}
          </div>

          <div className="space-y-3">
            {content.sections.map((section: any) => (
              <div key={section.id} className="p-3 bg-gray-50 border border-gray-100">
                {editingSection?.id === section.id ? (
                  <SectionForm
                    initial={editingSection ?? undefined}
                    onSave={(data) => handleSaveSection(data, section.id)}
                    onCancel={() => setEditingSection(null)}
                  />
                ) : (
                  <div className="flex gap-3 items-start">
                    {section.imageSrc && (
                      <img src={section.imageSrc} alt={section.imageAlt ?? ""} className="w-16 h-14 object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium">{section.title}</p>
                      {section.subtitle && <p className="text-gray-500 text-xs">{section.subtitle}</p>}
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{section.body}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <AdminButton variant="outline" size="sm" onClick={() => setEditingSection(section)}>Edit</AdminButton>
                      <AdminButton variant="danger" size="sm" onClick={() => setDeleteSectionId(section.id)}>×</AdminButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showAddSection && (
            <SectionForm
              onSave={(data) => handleSaveSection(data)}
              onCancel={() => setShowAddSection(false)}
            />
          )}
        </AdminCard>
      </div>

      <ConfirmDialog
        open={!!deleteSectionId}
        title="Delete Section"
        message="This section will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteSection}
        onCancel={() => setDeleteSectionId(null)}
        danger
      />
    </AdminPageShell>
  );
}
