// app/admin/homepage/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageLoader,
  ConfirmDialog,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import { getHomeFeatureLinks, upsertHomeFeatureLink, deleteHomeFeatureLink } from "@/src/actions/settings";
import type { HomeFeatureLink } from "@/src/generated/prisma/client";

const NAV_OPTIONS = [
  "/ready-to-wear",
  "/lookbook",
  "/the-house",
  "/craft-legacy",
  "/appointments",
  "/journal",
];

function FeatureLinkForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<HomeFeatureLink>;
  onSave: (data: unknown) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    href: initial?.href ?? "/ready-to-wear",
    imagePublicId: initial?.imagePublicId ?? "",
    imageSrc: initial?.imageSrc ?? "",
    imageAlt: initial?.imageAlt ?? "",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageSrc) { setError("Image required"); return; }
    setSaving(true);
    try { await onSave(form); } catch { setError("Failed to save"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-100 pt-4 mt-4">
      <h4 className="text-gray-500 text-xs uppercase tracking-wider">{initial?.id ? "Edit Feature" : "Add Feature Link"}</h4>
      <CloudinaryUpload
        label="Feature Image *"
        value={form.imageSrc ? { publicId: form.imagePublicId, src: form.imageSrc, alt: form.imageAlt } : null}
        onChange={(v) => setForm({ ...form, imagePublicId: v?.publicId ?? "", imageSrc: v?.src ?? "", imageAlt: v?.alt ?? "" })}
        folder="homepage"
      />
      <div className="grid grid-cols-2 gap-3">
        <AdminInput label="Label" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <AdminInput label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">Link To</label>
        <select
          value={form.href}
          onChange={(e) => setForm({ ...form, href: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-gray-900"
        >
          {NAV_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <AdminButton type="submit" size="sm" loading={saving}>{initial?.id ? "Save" : "Add"}</AdminButton>
        <AdminButton type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</AdminButton>
      </div>
    </form>
  );
}

export default function HomepagePage() {
  const [links, setLinks] = React.useState<HomeFeatureLink[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAdd, setShowAdd] = React.useState(false);
  const [editingLink, setEditingLink] = React.useState<HomeFeatureLink | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setLinks(await getHomeFeatureLinks());
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleSave(data: unknown, id?: string) {
    await upsertHomeFeatureLink(id ?? null, data as Parameters<typeof upsertHomeFeatureLink>[1]);
    setShowAdd(false);
    setEditingLink(null);
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteHomeFeatureLink(deleteTarget);
    setDeleteTarget(null);
    await load();
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell title="Homepage" subtitle="Feature links & navigation panels">
      <div className="max-w-3xl">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">Feature Navigation Links</h3>
              <p className="text-gray-400 text-xs mt-1">These are the large image panels on the homepage that navigate to site sections.</p>
            </div>
            {!showAdd && !editingLink && (
              <AdminButton size="sm" variant="ghost" onClick={() => setShowAdd(true)}>+ Add</AdminButton>
            )}
          </div>

          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex gap-3 items-center p-2 bg-gray-50 border border-gray-100">
                {link.imageSrc ? (
                  <img src={link.imageSrc} alt={link.imageAlt} className="w-16 h-12 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-12 bg-gray-50 shrink-0" />
                )}
                {editingLink?.id === link.id ? (
                  <div className="flex-1">
                    <FeatureLinkForm
                      initial={editingLink}
                      onSave={(data) => handleSave(data, link.id)}
                      onCancel={() => setEditingLink(null)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium">{link.title}</p>
                      <p className="text-gray-400 text-xs">{link.href}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <AdminButton variant="outline" size="sm" onClick={() => setEditingLink(link)}>Edit</AdminButton>
                      <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(link.id)}>×</AdminButton>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showAdd && (
            <FeatureLinkForm
              onSave={(data) => handleSave(data)}
              onCancel={() => setShowAdd(false)}
            />
          )}
        </AdminCard>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Feature Link"
        message="This will remove the feature panel from the homepage."
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </AdminPageShell>
  );
}
