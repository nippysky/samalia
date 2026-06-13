// app/admin/settings/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  AdminPageLoader,
} from "@/src/components/admin/admin-ui";
import { CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import { getSiteSettings, updateSiteSettings } from "@/src/actions/settings";
import type { SiteSettings } from "@/src/generated/prisma/client";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState<Record<string, unknown>>({});

  async function load() {
    setLoading(true);
    const s = await getSiteSettings();
    setSettings(s);
    setForm({
      siteName: s.siteName,
      siteTagline: s.siteTagline ?? "",
      siteDescription: s.siteDescription ?? "",
      contactEmail: s.contactEmail ?? "",
      contactPhone: s.contactPhone ?? "",
      instagramUrl: s.instagramUrl ?? "",
      twitterUrl: s.twitterUrl ?? "",
      facebookUrl: s.facebookUrl ?? "",
      maintenanceMode: s.maintenanceMode,
      maintenanceMessage: s.maintenanceMessage ?? "",
      appointmentsEnabled: s.appointmentsEnabled,
      ordersEnabled: s.ordersEnabled,
      logoPublicId: s.logoPublicId ?? "",
      logoSrc: s.logoSrc ?? "",
    });
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await updateSiteSettings(settings.id, form as Parameters<typeof updateSiteSettings>[1]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await load();
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell title="Settings" subtitle="Site configuration">
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Brand */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Brand</h3>
          <div className="space-y-3">
            <AdminInput
              label="Site Name"
              value={form.siteName as string}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            />
            <AdminInput
              label="Tagline"
              value={form.siteTagline as string}
              onChange={(e) => setForm({ ...form, siteTagline: e.target.value })}
            />
            <AdminTextarea
              label="Site Description (SEO)"
              value={form.siteDescription as string}
              onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
              rows={2}
            />
            <CloudinaryUpload
              label="Logo"
              value={(form.logoSrc as string) ? { publicId: form.logoPublicId as string, src: form.logoSrc as string, alt: form.siteName as string } : null}
              onChange={(v) => setForm({ ...form, logoPublicId: v?.publicId ?? "", logoSrc: v?.src ?? "" })}
              folder="brand"
            />
          </div>
        </AdminCard>

        {/* Contact */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Contact</h3>
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Email"
              type="email"
              value={form.contactEmail as string}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
            <AdminInput
              label="Phone"
              value={form.contactPhone as string}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            />
          </div>
        </AdminCard>

        {/* Social */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Social Media</h3>
          <div className="space-y-3">
            <AdminInput
              label="Instagram URL"
              value={form.instagramUrl as string}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/samaila"
            />
            <AdminInput
              label="Twitter / X URL"
              value={form.twitterUrl as string}
              onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
            />
            <AdminInput
              label="Facebook URL"
              value={form.facebookUrl as string}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
            />
          </div>
        </AdminCard>

        {/* Toggles */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Features</h3>
          <div className="space-y-4">
            <AdminToggle
              label="Accept Orders"
              checked={form.ordersEnabled as boolean}
              onChange={(v) => setForm({ ...form, ordersEnabled: v })}
            />
            <AdminToggle
              label="Accept Appointment Bookings"
              checked={form.appointmentsEnabled as boolean}
              onChange={(v) => setForm({ ...form, appointmentsEnabled: v })}
            />
          </div>
        </AdminCard>

        {/* Maintenance */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Maintenance</h3>
          <div className="space-y-3">
            <AdminToggle
              label="Maintenance Mode"
              checked={form.maintenanceMode as boolean}
              onChange={(v) => setForm({ ...form, maintenanceMode: v })}
            />
            {!!(form.maintenanceMode) && (
              <AdminTextarea
                label="Maintenance Message"
                value={form.maintenanceMessage as string}
                onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
                rows={2}
                placeholder="We'll be back shortly."
              />
            )}
          </div>
        </AdminCard>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {saved && <p className="text-green-400 text-sm">Settings saved successfully.</p>}

        <AdminButton type="submit" loading={saving}>Save Settings</AdminButton>
      </form>
    </AdminPageShell>
  );
}
