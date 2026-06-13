// app/admin/products/[id]/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminToggle,
  AdminPageLoader,
  AdminFormActions,
  ConfirmDialog,
} from "@/src/components/admin/admin-ui";
import { MultiCloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import {
  getProductById,
  updateProduct,
  upsertProductVariant,
  deleteProductVariant,
} from "@/src/actions/products";
import type { Product, ProductImage, ProductVariant } from "@/src/generated/prisma/client";

type ProductFull = Product & { images: ProductImage[]; variants: ProductVariant[] };

const CATEGORIES = [
  { value: "ready-to-wear", label: "Ready to Wear" },
  { value: "bespoke", label: "Bespoke" },
  { value: "accessories", label: "Accessories" },
  { value: "outerwear", label: "Outerwear" },
];
const TIERS = [
  { value: "READY_TO_WEAR", label: "Ready to Wear" },
  { value: "BESPOKE", label: "Bespoke" },
  { value: "MADE_TO_ORDER", label: "Made to Order" },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = React.useState<ProductFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [deleteVariantId, setDeleteVariantId] = React.useState<string | null>(null);
  const [images, setImages] = React.useState<{ publicId: string; src: string; alt: string }[]>([]);
  const [form, setForm] = React.useState<Record<string, unknown>>({});

  async function load() {
    const p = await getProductById(params.id);
    if (!p) return;
    setProduct(p as ProductFull);
    setImages((p as ProductFull).images.map((img: any) => ({ publicId: img.imagePublicId as string, src: img.src as string, alt: img.alt as string })));
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description ?? "",
      priceKobo: String(p.priceKobo / 100),
      comparePriceKobo: p.comparePriceKobo ? String(p.comparePriceKobo / 100) : "",
      categorySlug: p.categorySlug,
      tier: p.tier,
      material: p.material ?? "",
      careInstructions: p.careInstructions ?? "",
      tags: p.tags.join(", "),
      featured: p.featured,
      available: p.available,
    });
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const data = {
        ...form,
        priceKobo: parseInt(form.priceKobo as string) * 100,
        comparePriceKobo: form.comparePriceKobo ? parseInt(form.comparePriceKobo as string) * 100 : null,
        tags: form.tags ? (form.tags as string).split(",").map((t: string) => t.trim()) : [],
      };
      const result = await updateProduct(
        params.id,
        data,
        images.map((img, i) => ({ imagePublicId: img.publicId, src: img.src, alt: img.alt, order: i }))
      );
      if (result && "error" in result) { setError("Validation failed"); return; }
      router.push("/admin/products");
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteVariant() {
    if (!deleteVariantId) return;
    await deleteProductVariant(deleteVariantId);
    setDeleteVariantId(null);
    await load();
  }

  if (loading || !product) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title={product.name}
      subtitle="Edit product"
      actions={
        <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/products")}>
          ← Back
        </AdminButton>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Product Images</h3>
          <MultiCloudinaryUpload
            label="Product photos"
            values={images}
            onChange={setImages}
            folder="products"
            maxImages={8}
          />
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Product Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Name *" value={form.name as string} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <AdminInput label="Slug *" value={form.slug as string} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            <AdminInput label="SKU *" value={form.sku as string} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <AdminSelect label="Category" value={form.categorySlug as string} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} options={CATEGORIES} />
            <AdminSelect label="Tier" value={form.tier as string} onChange={(e) => setForm({ ...form, tier: e.target.value })} options={TIERS} />
            <AdminInput label="Material" value={form.material as string} onChange={(e) => setForm({ ...form, material: e.target.value })} />
          </div>
          <div className="mt-4 space-y-4">
            <AdminTextarea label="Description" value={form.description as string} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            <AdminTextarea label="Care Instructions" value={form.careInstructions as string} onChange={(e) => setForm({ ...form, careInstructions: e.target.value })} rows={2} />
            <AdminInput label="Tags (comma separated)" value={form.tags as string} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput label="Price (₦) *" type="number" value={form.priceKobo as string} onChange={(e) => setForm({ ...form, priceKobo: e.target.value })} required />
            <AdminInput label="Compare Price (₦)" type="number" value={form.comparePriceKobo as string} onChange={(e) => setForm({ ...form, comparePriceKobo: e.target.value })} />
          </div>
        </AdminCard>

        {/* Variants read-only (manage from inventory page) */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">Variants</h3>
            <a href="/admin/inventory" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">
              Manage stock →
            </a>
          </div>
          {product.variants.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No variants — single-size product.</p>
          ) : (
            <div className="space-y-2">
              {product.variants.map((v: any) => (
                <div key={v.id} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 text-sm w-8">{v.size}</span>
                  <span className="text-gray-500 text-sm flex-1">{v.color || "—"}</span>
                  <span className="text-gray-400 text-xs font-mono">{v.sku}</span>
                  <span className={`text-sm tabular-nums ${v.stock <= 0 ? "text-red-500" : v.stock <= 3 ? "text-yellow-400" : "text-green-400"}`}>
                    {v.stock} in stock
                  </span>
                  <AdminButton variant="danger" size="sm" onClick={() => setDeleteVariantId(v.id)}>
                    ×
                  </AdminButton>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Visibility</h3>
          <div className="flex gap-8">
            <AdminToggle label="Available on site" checked={form.available as boolean} onChange={(v) => setForm({ ...form, available: v })} />
            <AdminToggle label="Featured" checked={form.featured as boolean} onChange={(v) => setForm({ ...form, featured: v })} />
          </div>
        </AdminCard>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AdminFormActions>
          <AdminButton type="submit" loading={saving}>Save Changes</AdminButton>
          <AdminButton variant="ghost" type="button" onClick={() => router.push("/admin/products")}>Cancel</AdminButton>
        </AdminFormActions>
      </form>

      <ConfirmDialog
        open={!!deleteVariantId}
        title="Remove Variant"
        message="This will permanently remove this variant and its stock record."
        confirmLabel="Remove"
        onConfirm={handleDeleteVariant}
        onCancel={() => setDeleteVariantId(null)}
        danger
      />
    </AdminPageShell>
  );
}
