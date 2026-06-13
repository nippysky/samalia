// app/admin/orders/page.tsx
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
  StatusBadge,
  AdminInput,
  AdminSelect,
} from "@/src/components/admin/admin-ui";
import { getOrders } from "@/src/actions/orders";
import { formatPrice, formatDate, orderStatusLabel } from "@/src/lib/utils";
import type { Order } from "@/src/generated/prisma/client";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "READY", label: "Ready" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pages = Math.ceil(total / 20);

  async function load(q?: string, s?: string, p = 1) {
    setLoading(true);
    const result = await getOrders({
      search: q || undefined,
      status: (s as Order["status"]) || undefined,
      page: p,
    });
    setOrders(result.items);
    setTotal(result.total);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(search, status, 1);
  }

  if (loading) return <AdminPageLoader />;

  return (
    <AdminPageShell title="Orders" subtitle={`${total} total`}>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6 flex-wrap">
        <AdminInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, name, or email…"
          className="max-w-xs"
        />
        <AdminSelect
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); load(search, e.target.value, 1); }}
          options={STATUS_OPTIONS}
          className="max-w-[180px]"
        />
        <AdminButton type="submit" variant="secondary" size="sm">Search</AdminButton>
        {(search || status) && (
          <AdminButton variant="ghost" size="sm" onClick={() => { setSearch(""); setStatus(""); setPage(1); load(); }}>
            Clear
          </AdminButton>
        )}
      </form>

      {orders.length === 0 ? (
        <AdminEmptyState title="No orders found" description="Orders placed through the site will appear here." />
      ) : (
        <>
          <AdminTable headers={["Order #", "Customer", "Date", "Items", "Total", "Status", "Payment", ""]}>
            {orders.map((order) => (
              <AdminTableRow key={order.id}>
                <AdminTableCell>
                  <span className="text-gray-600 text-sm font-mono">{order.orderNumber}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div>
                    <p className="text-gray-800 text-sm">{order.customerName}</p>
                    <p className="text-gray-400 text-xs">{order.customerEmail}</p>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-500 text-sm">{formatDate(order.createdAt)}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-500 text-sm">{order.itemCount}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-gray-900 text-sm font-medium">{formatPrice(order.total)}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge
                    status={
                      order.status === "DELIVERED" ? "success"
                        : order.status === "CANCELLED" ? "danger"
                        : order.status === "SHIPPED" || order.status === "READY" ? "warning"
                        : "neutral"
                    }
                  >
                    {orderStatusLabel(order.status)}
                  </StatusBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "FAILED" ? "danger" : "neutral"}>
                    {order.paymentStatus}
                  </StatusBadge>
                </AdminTableCell>
                <AdminTableCell>
                  <Link href={`/admin/orders/${order.id}`}>
                    <AdminButton variant="outline" size="sm">View</AdminButton>
                  </Link>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>

          {pages > 1 && (
            <div className="flex items-center gap-3 mt-4 justify-end">
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => { const p = page - 1; setPage(p); load(search, status, p); }}
                disabled={page <= 1}
              >
                ← Prev
              </AdminButton>
              <span className="text-gray-400 text-sm">{page} / {pages}</span>
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => { const p = page + 1; setPage(p); load(search, status, p); }}
                disabled={page >= pages}
              >
                Next →
              </AdminButton>
            </div>
          )}
        </>
      )}
    </AdminPageShell>
  );
}
