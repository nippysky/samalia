// app/admin/journal/new/page.tsx
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
import { createJournalArticle } from "@/src/actions/journal";

export default function NewJournalPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const [form, setForm] = React.useState({
    title: "",
    slug: "",
    subtitle: "",
    category: "",
    excerpt: "",
    author: "",
    published: false,
    coverImagePublicId: "",
    coverImageSrc: "",
    coverImageAlt: "",
  });

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) { setError("Title required"); return; }
    setSaving(true);
    setError("");
    try {
      const result = await createJournalArticle({ ...form, publishedAt: form.published ? new Date() : null });
      if (result && "error" in result) { setError("Validation failed"); return; }
      router.push(`/admin/journal/${result.id}`);
    } catch {
      setError("Failed to create article");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell
      title="New Article"
      subtitle="Journal"
      actions={
        <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/journal")}>
          ← Back
        </AdminButton>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Article Details</h3>
          <div className="space-y-3">
            <AdminInput
              label="Title *"
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
            />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Culture"
              />
              <AdminInput
                label="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <AdminTextarea
              label="Excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              placeholder="Brief description for listing pages"
            />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Cover Image</h3>
          <CloudinaryUpload
            label="Cover photo"
            value={form.coverImageSrc ? { publicId: form.coverImagePublicId, src: form.coverImageSrc, alt: form.coverImageAlt } : null}
            onChange={(v) => setForm({ ...form, coverImagePublicId: v?.publicId ?? "", coverImageSrc: v?.src ?? "", coverImageAlt: v?.alt ?? "" })}
            folder="journal"
          />
        </AdminCard>

        <AdminCard>
          <AdminToggle
            label="Publish immediately"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
        </AdminCard>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AdminFormActions>
          <AdminButton type="submit" loading={saving}>Create & Add Content</AdminButton>
          <AdminButton variant="ghost" type="button" onClick={() => router.push("/admin/journal")}>Cancel</AdminButton>
        </AdminFormActions>
      </form>
    </AdminPageShell>
  );
}
