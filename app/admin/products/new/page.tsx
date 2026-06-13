// app/admin/products/new/page.tsx
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
  AdminFormActions,
} from "@/src/components/admin/admin-ui";
import { MultiCloudinaryUpload, CloudinaryUpload } from "@/src/components/admin/cloudinary-upload";
import { createProduct } from "@/src/actions/products";

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

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [images, setImages] = React.useState<{ publicId: string; src: string; alt: string }[]>([]);
  const [variants, setVariants] = React.useState<{ size: string; color: string; stock: number; sku: string }[]>([]);

  const [form, setForm] = React.useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    priceKobo: "",
    comparePriceKobo: "",
    categorySlug: "ready-to-wear",
    tier: "READY_TO_WEAR",
    material: "",
    careInstructions: "",
    tags: "",
    featured: false,
    available: true,
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function addVariant() {
    setVariants((v) => [...v, { size: "M", color: "", stock: 0, sku: "" }]);
  }

  function updateVariant(i: number, field: string, value: string | number) {
    setVariants((v) => v.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) { setError("At least one product image is required"); return; }
    setSaving(true);
    setError("");
    try {
      const data = {
        ...form,
        priceKobo: parseInt(form.priceKobo) * 100,
        comparePriceKobo: form.comparePriceKobo ? parseInt(form.comparePriceKobo) * 100 : null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      const result = await createProduct(
        data,
        images.map((img, i) => ({ imagePublicId: img.publicId, src: img.src, alt: img.alt, order: i })),
        variants
      );
      if ("error" in result) {
        setError("Validation failed — check required fields");
        return;
      }
      router.push("/admin/products");
    } catch {
      setError("Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPageShell
      title="New Product"
      subtitle="Add to catalogue"
      actions={
        <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/products")}>
          ← Back
        </AdminButton>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Images */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Product Images</h3>
          <MultiCloudinaryUpload
            label="Upload product photos (first image is the cover)"
            values={images}
            onChange={setImages}
            folder="products"
            maxImages={8}
          />
        </AdminCard>

        {/* Basic Info */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Product Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Product Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value), sku: autoSlug(e.target.value).toUpperCase().substring(0, 8) })}
              required
            />
            <AdminInput
              label="Slug *"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
            <AdminInput
              label="SKU *"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
            />
            <AdminSelect
              label="Category *"
              value={form.categorySlug}
              onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
              options={CATEGORIES}
            />
            <AdminSelect
              label="Tier"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value })}
              options={TIERS}
            />
            <AdminInput
              label="Material"
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Care Instructions"
              value={form.careInstructions}
              onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
              rows={2}
            />
          </div>
          <div className="mt-4">
            <AdminInput
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. agbada, traditional, men"
            />
          </div>
        </AdminCard>

        {/* Pricing */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Price (₦) *"
              type="number"
              value={form.priceKobo}
              onChange={(e) => setForm({ ...form, priceKobo: e.target.value })}
              required
              placeholder="e.g. 85000"
            />
            <AdminInput
              label="Compare Price (₦)"
              type="number"
              value={form.comparePriceKobo}
              onChange={(e) => setForm({ ...form, comparePriceKobo: e.target.value })}
              placeholder="Original price if on sale"
            />
          </div>
        </AdminCard>

        {/* Variants / Inventory */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase">Variants & Stock</h3>
            <AdminButton type="button" variant="ghost" size="sm" onClick={addVariant}>
              + Add Variant
            </AdminButton>
          </div>
          {variants.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No variants added — product will show as one-size.</p>
          ) : (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-end">
                  <AdminSelect
                    label={i === 0 ? "Size" : ""}
                    value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                    options={SIZES.map((s) => ({ value: s, label: s }))}
                  />
                  <AdminInput
                    label={i === 0 ? "Color" : ""}
                    value={v.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                    placeholder="e.g. Ivory"
                  />
                  <AdminInput
                    label={i === 0 ? "Stock" : ""}
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value) || 0)}
                  />
                  <AdminInput
                    label={i === 0 ? "Variant SKU" : ""}
                    value={v.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    placeholder="e.g. NCS-M-IV"
                  />
                  <div className="pb-0.5">
                    <AdminButton
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeVariant(i)}
                    >
                      ×
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Visibility */}
        <AdminCard>
          <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Visibility</h3>
          <div className="flex gap-8">
            <AdminToggle
              label="Available on site"
              checked={form.available}
              onChange={(v) => setForm({ ...form, available: v })}
            />
            <AdminToggle
              label="Featured product"
              checked={form.featured}
              onChange={(v) => setForm({ ...form, featured: v })}
            />
          </div>
        </AdminCard>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <AdminFormActions>
          <AdminButton type="submit" loading={saving}>Create Product</AdminButton>
          <AdminButton variant="ghost" type="button" onClick={() => router.push("/admin/products")}>Cancel</AdminButton>
        </AdminFormActions>
      </form>
    </AdminPageShell>
  );
}
