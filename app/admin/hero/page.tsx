// app/admin/hero/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminEmptyState,
  AdminPageLoader,
  ConfirmDialog,
  StatusBadge,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from "@/src/actions/hero";
import type { HeroSlide } from "@/src/generated/prisma/client";

const LINK_OPTIONS = [
  { value: "/ready-to-wear", label: "Ready to Wear" },
  { value: "/lookbook", label: "Lookbook" },
  { value: "/the-house", label: "The House" },
  { value: "/craft-legacy", label: "Craft & Legacy" },
  { value: "/appointments", label: "Appointments" },
  { value: "/journal", label: "Journal" },
];

const POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

function SlideForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HeroSlide>;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState({
    headline: initial?.headline ?? "",
    subheadline: initial?.subheadline ?? "",
    ctaLabel: initial?.ctaLabel ?? "",
    ctaHref: initial?.ctaHref ?? "/ready-to-wear",
    imagePublicId: initial?.imagePublicId ?? "",
    imageSrc: initial?.imageSrc ?? "",
    imageAlt: initial?.imageAlt ?? "",
    imagePosition: initial?.imagePosition ?? "center",
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageSrc) { setError("Image required"); return; }
    setSaving(true);
    try {
      await onSave(form);
    } catch {
      setError("Failed to save slide");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <CloudinaryUpload
        label="Slide Image"
        value={form.imageSrc ? { publicId: form.imagePublicId, src: form.imageSrc, alt: form.imageAlt } : null}
        onChange={(v) => setForm({ ...form, imagePublicId: v?.publicId ?? "", imageSrc: v?.src ?? "", imageAlt: v?.alt ?? "" })}
        folder="hero"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AdminInput
          label="Headline"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
        />
        <AdminInput
          label="Subheadline"
          value={form.subheadline}
          onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
        />
        <AdminInput
          label="CTA Button Label"
          value={form.ctaLabel}
          onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
        />
        <AdminSelect
          label="CTA Link"
          value={form.ctaHref}
          onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
          options={LINK_OPTIONS}
        />
        <AdminSelect
          label="Image Position"
          value={form.imagePosition}
          onChange={(e) => setForm({ ...form, imagePosition: e.target.value })}
          options={POSITION_OPTIONS}
        />
        <AdminInput
          label="Image Alt Text"
          value={form.imageAlt}
          onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3 pt-2">
        <AdminButton type="submit" loading={saving}>
          {initial?.id ? "Save Changes" : "Create Slide"}
        </AdminButton>
        <AdminButton variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState<"list" | "new" | "edit">("list");
  const [editing, setEditing] = React.useState<HeroSlide | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setSlides(await getHeroSlides());
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleSave(data: Record<string, unknown>) {
    if (editing) {
      await updateHeroSlide(editing.id, data);
    } else {
      await createHeroSlide(data);
    }
    setMode("list");
    setEditing(null);
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteHeroSlide(deleteTarget);
    setDeleteTarget(null);
    await load();
  }

  async function handleToggle(slide: HeroSlide) {
    await updateHeroSlide(slide.id, { isActive: !slide.isActive });
    await load();
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="Hero Slides"
      subtitle={`${slides.length} slides`}
      actions={
        mode === "list" ? (
          <AdminButton size="sm" onClick={() => setMode("new")}>
            + Add Slide
          </AdminButton>
        ) : null
      }
    >
      {mode !== "list" ? (
        <AdminCard>
          <h3 className="text-gray-900 font-medium mb-5">
            {mode === "new" ? "New Slide" : "Edit Slide"}
          </h3>
          <SlideForm
            initial={editing ?? undefined}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
          />
        </AdminCard>
      ) : slides.length === 0 ? (
        <AdminEmptyState
          title="No hero slides yet"
          description="Add your first slide to populate the homepage banner."
          action={<AdminButton onClick={() => setMode("new")}>+ Add First Slide</AdminButton>}
        />
      ) : (
        <AdminTable headers={["Order", "Image", "Headline", "CTA Link", "Status", ""]}>
          {slides.map((slide, idx) => (
            <AdminTableRow key={slide.id}>
              <AdminTableCell>
                <span className="text-gray-400 tabular-nums">{idx + 1}</span>
              </AdminTableCell>
              <AdminTableCell>
                {slide.imageSrc ? (
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className="w-16 h-10 object-cover"
                  />
                ) : (
                  <div className="w-16 h-10 bg-gray-50 flex items-center justify-center text-gray-300 text-xs">
                    No img
                  </div>
                )}
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-800">{slide.headline || <span className="text-gray-400 italic">No headline</span>}</span>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 text-sm">{slide.ctaHref}</span>
              </AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={slide.isActive ? "success" : "neutral"}>
                  {slide.isActive ? "Active" : "Hidden"}
                </StatusBadge>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 justify-end">
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggle(slide)}
                  >
                    {slide.isActive ? "Hide" : "Show"}
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditing(slide); setMode("edit"); }}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(slide.id)}
                  >
                    Delete
                  </AdminButton>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Slide"
        message="This will permanently remove the slide from the hero banner."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </AdminPageShell>
  );
}
