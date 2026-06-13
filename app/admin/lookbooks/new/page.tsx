// app/admin/lookbooks/new/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  AdminFormActions,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import { createLookbook } from "@/src/actions/lookbooks";

export default function NewLookbookPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    title: "",
    slug: "",
    subtitle: "",
    season: "",
    description: "",
    isPublished: false,
    coverImagePublicId: "",
    coverImageSrc: "",
    coverImageAlt: "",
    heroImagePublicId: "",
    heroImageSrc: "",
    heroImageAlt: "",
  });

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.coverImageSrc) { setError("Cover image required"); return; }
    setSaving(true);
    setError("");
    try {
      const result = await createLookbook(form, [], []);
      if (result && "error" in result) { setError("Validation failed"); return; }
      router.push(`/admin/lookbooks/${result.id}`);
    } catch {
      setError("Failed to create lookbook");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell
      title="New Lookbook"
      subtitle="Create a collection"
      actions={
        <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/lookbooks")}>
          ← Back
        </AdminButton>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Details</h3>
          <div className="space-y-4">
            <AdminInput
              label="Collection Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
              required
            />
            <AdminInput
              label="Slug *"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
            <AdminInput
              label="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. A study in form and restraint"
            />
            <AdminInput
              label="Season / Year"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              placeholder="e.g. SS 2025"
            />
            <AdminTextarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Cover Image *</h3>
          <CloudinaryUpload
            label="Cover photo"
            value={form.coverImageSrc ? { publicId: form.coverImagePublicId, src: form.coverImageSrc, alt: form.coverImageAlt } : null}
            onChange={(v) => setForm({ ...form, coverImagePublicId: v?.publicId ?? "", coverImageSrc: v?.src ?? "", coverImageAlt: v?.alt ?? "" })}
            folder="lookbooks"
          />
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Hero Image</h3>
          <CloudinaryUpload
            label="Full-width hero photo"
            value={form.heroImageSrc ? { publicId: form.heroImagePublicId, src: form.heroImageSrc, alt: form.heroImageAlt } : null}
            onChange={(v) => setForm({ ...form, heroImagePublicId: v?.publicId ?? "", heroImageSrc: v?.src ?? "", heroImageAlt: v?.alt ?? "" })}
            folder="lookbooks"
          />
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Visibility</h3>
          <AdminToggle
            label="Publish immediately"
            checked={form.isPublished}
            onChange={(v) => setForm({ ...form, isPublished: v })}
          />
        </AdminCard>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AdminFormActions>
          <AdminButton type="submit" loading={saving}>Create & Add Looks</AdminButton>
          <AdminButton variant="ghost" type="button" onClick={() => router.push("/admin/lookbooks")}>Cancel</AdminButton>
        </AdminFormActions>
      </form>
    </AdminPageShell>
  );
}
