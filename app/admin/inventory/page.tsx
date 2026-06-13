// app/admin/inventory/page.tsx
"use client";

import * as React from "react";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminPageLoader,
  AdminEmptyState,
  StatusBadge,
  AdminInput,
} from "@/src/components/admin/admin-ui";
import { getInventorySummary, upsertProductVariant } from "@/src/actions/products";
import type { ProductVariant } from "@/src/generated/prisma/client";

type VariantWithProduct = ProductVariant & {
  product: { name: string; sku: string; categorySlug: string };
};

export default function InventoryPage() {
  const [variants, setVariants] = React.useState<VariantWithProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editStock, setEditStock] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setVariants((await getInventorySummary()) as VariantWithProduct[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function saveStock(v: VariantWithProduct) {
    const val = parseInt(editStock[v.id] ?? String(v.stock));
    if (isNaN(val)) return;
    setSaving(v.id);
    await upsertProductVariant(v.productId, v.id, {
      size: v.size ?? "",
      color: v.color ?? "",
      sku: v.sku ?? "",
      stock: val,
    });
    setSaving(null);
    setEditingId(null);
    await load();
  }

  function stockStatus(stock: number): { status: "success" | "warning" | "danger" | "neutral"; label: string } {
    if (stock <= 0) return { status: "danger", label: "Out of Stock" };
    if (stock <= 3) return { status: "warning", label: "Low Stock" };
    return { status: "success", label: "In Stock" };
  }

  if (loading) return <AdminPageLoader />;

  const outOfStock = variants.filter((v) => v.stock <= 0).length;
  const lowStock = variants.filter((v) => v.stock > 0 && v.stock <= 3).length;

  return (
    <AdminPageShell
      title="Inventory"
      subtitle={`${variants.length} variants · ${outOfStock} out of stock · ${lowStock} low`}
    >
      {variants.length === 0 ? (
        <AdminEmptyState
          title="No inventory"
          description="Add products with variants to track stock here."
        />
      ) : (
        <AdminTable headers={["Product", "SKU", "Size", "Color", "Stock", "Status", ""]}>
          {variants.map((v) => {
            const { status, label } = stockStatus(v.stock);
            const isEditing = editingId === v.id;
            return (
              <AdminTableRow key={v.id}>
                <AdminTableCell>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{v.product.name}</p>
                    <p className="text-gray-400 text-xs">{v.product.categorySlug}</p>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-400 text-xs font-mono">{v.sku ?? v.product.sku}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-600 text-sm">{v.size ?? "—"}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-500 text-sm">{v.color || "—"}</span>
                </AdminTableCell>
                <AdminTableCell>
                  {isEditing ? (
                    <AdminInput
                      type="number"
                      value={editStock[v.id] ?? String(v.stock)}
                      onChange={(e) => setEditStock({ ...editStock, [v.id]: e.target.value })}
                      className="w-20"
                    />
                  ) : (
                    <span className={`tabular-nums text-sm font-medium ${v.stock <= 0 ? "text-red-500" : v.stock <= 3 ? "text-yellow-400" : "text-gray-800"}`}>
                      {v.stock}
                    </span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={status}>{label}</StatusBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-2 justify-end">
                    {isEditing ? (
                      <>
                        <AdminButton
                          size="sm"
                          loading={saving === v.id}
                          onClick={() => saveStock(v)}
                        >
                          Save
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </AdminButton>
                      </>
                    ) : (
                      <AdminButton
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(v.id);
                          setEditStock({ ...editStock, [v.id]: String(v.stock) });
                        }}
                      >
                        Edit Stock
                      </AdminButton>
                    )}
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTable>
      )}
    </AdminPageShell>
  );
}
