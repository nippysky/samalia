// app/admin/products/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
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
  AdminInput,
} from "@/src/components/admin/admin-ui";
import { getProducts, deleteProduct } from "@/src/actions/products";
import { formatPrice } from "@/src/lib/utils";
import type { Product, ProductImage } from "@/src/generated/prisma/client";

type ProductWithImages = Product & { images: ProductImage[] };

export default function ProductsPage() {
  const [products, setProducts] = React.useState<ProductWithImages[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  async function load(q?: string) {
    setLoading(true);
    const data = await getProducts(q ? { search: q } : undefined);
    setProducts(data as ProductWithImages[]);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget);
    setDeleteTarget(null);
    await load(search);
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title="Products"
      subtitle={`${products.length} items`}
      actions={
        <Link href="/admin/products/new">
          <AdminButton size="sm">+ New Product</AdminButton>
        </Link>
      }
    >
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <AdminInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, or tag…"
          className="max-w-sm"
        />
        <AdminButton type="submit" variant="secondary" size="sm">Search</AdminButton>
        {search && (
          <AdminButton variant="ghost" size="sm" onClick={() => { setSearch(""); load(); }}>
            Clear
          </AdminButton>
        )}
      </form>

      {products.length === 0 ? (
        <AdminEmptyState
          title="No products found"
          description="Add your first product to populate the catalogue."
          action={
            <Link href="/admin/products/new">
              <AdminButton>+ Add Product</AdminButton>
            </Link>
          }
        />
      ) : (
        <AdminTable
          headers={["Image", "Name", "SKU", "Category", "Price", "Status", ""]}
        >
          {products.map((product) => (
            <AdminTableRow key={product.id}>
              <AdminTableCell>
                {product.images[0] ? (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    className="w-12 h-14 object-cover"
                  />
                ) : (
                  <div className="w-12 h-14 bg-gray-50 flex items-center justify-center text-gray-300 text-xs">
                    —
                  </div>
                )}
              </AdminTableCell>
              <AdminTableCell>
                <div>
                  <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                  {product.tier !== "READY_TO_WEAR" && (
                    <p className="text-gray-400 text-xs mt-0.5">{product.tier}</p>
                  )}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 text-xs font-mono">{product.sku}</span>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-500 text-sm capitalize">
                  {product.categorySlug.replace(/-/g, " ")}
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <span className="text-gray-600 text-sm">{formatPrice(product.priceKobo)}</span>
              </AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={product.available ? "success" : "neutral"}>
                  {product.available ? "Available" : "Unavailable"}
                </StatusBadge>
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 justify-end">
                  <Link href={`/admin/products/${product.id}`}>
                    <AdminButton variant="outline" size="sm">Edit</AdminButton>
                  </Link>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(product.id)}
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
        title="Delete Product"
        message="This will permanently remove the product and all its variants and images."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </AdminPageShell>
  );
}
