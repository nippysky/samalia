// app/admin/orders/[id]/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminPageShell } from "@/src/components/admin/admin-topbar";
import {
  AdminButton,
  AdminCard,
  AdminSelect,
  AdminPageLoader,
  StatusBadge,
} from "@/src/components/admin/admin-ui";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/src/actions/orders";
import { formatPrice, formatDateTime, orderStatusLabel } from "@/src/lib/utils";
import type { Order, OrderItem, PaymentStatus } from "@/src/generated/prisma/client";

type OrderFull = Order & {
  items: (OrderItem & { product: { name: string; images: { src: string }[] } | null })[];
};

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "READY", label: "Ready" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = React.useState<OrderFull | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [newStatus, setNewStatus] = React.useState("");
  const [newPayment, setNewPayment] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function load() {
    const o = await getOrderById(params.id);
    if (o) {
      setOrder(o as OrderFull);
      setNewStatus(o.status);
      setNewPayment(o.paymentStatus);
    }
    setLoading(false);
  }

  React.useEffect(() => { load(); }, [params.id]);

  async function handleStatusSave() {
    if (!order) return;
    setSaving(true);
    await updateOrderStatus(order.id, { status: newStatus });
    await load();
    setSaving(false);
  }

  async function handlePaymentSave() {
    if (!order) return;
    setSaving(true);
    await updatePaymentStatus(order.id, newPayment as PaymentStatus);
    await load();
    setSaving(false);
  }

  if (loading || !order) return <AdminPageLoader />;

  return (
    <AdminPageShell
      title={`Order ${order.orderNumber}`}
      subtitle={formatDateTime(order.createdAt)}
      actions={
        <AdminButton variant="ghost" size="sm" onClick={() => router.push("/admin/orders")}>
          ← Back
        </AdminButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Left: Items + Customer */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">
              Items ({order.itemCount})
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-3 items-center py-2 border-b border-gray-100 last:border-0">
                  {item.product?.images[0] ? (
                    <img src={item.product.images[0].src} alt={item.productName} className="w-12 h-14 object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-14 bg-gray-50 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium truncate">{item.productName}</p>
                    {(item.size || item.color) && (
                      <p className="text-gray-400 text-xs mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm tabular-nums shrink-0">× {item.quantity}</span>
                  <span className="text-gray-800 text-sm font-medium tabular-nums shrink-0">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-gray-600 font-medium">{formatPrice(order.total)}</span>
            </div>
          </AdminCard>

          {/* Customer */}
          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Customer</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800 font-medium">{order.customerName}</p>
              <p className="text-gray-500">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-gray-500">{order.customerPhone}</p>}
            </div>
            {order.shippingAddress && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs tracking-wider uppercase mb-2">Delivery Address</p>
                <pre className="text-gray-500 text-sm whitespace-pre-wrap font-sans">
                  {typeof order.shippingAddress === "object"
                    ? Object.values(order.shippingAddress as Record<string, string>).filter(Boolean).join("\n")
                    : String(order.shippingAddress)}
                </pre>
              </div>
            )}
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs tracking-wider uppercase mb-2">Customer Notes</p>
                <p className="text-gray-500 text-sm">{order.notes}</p>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Right: Status management */}
        <div className="space-y-5">
          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Order Status</h3>
            <AdminSelect
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={ORDER_STATUSES}
            />
            <AdminButton
              className="mt-3 w-full"
              loading={saving}
              onClick={handleStatusSave}
              disabled={newStatus === order.status}
            >
              Update Status
            </AdminButton>
          </AdminCard>

          <AdminCard>
            <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-4">Payment</h3>
            <div className="mb-3">
              <StatusBadge status={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "FAILED" ? "danger" : "neutral"}>
                {order.paymentStatus}
              </StatusBadge>
            </div>
            {order.paymentReference && (
              <p className="text-gray-400 text-xs font-mono mb-3 break-all">{order.paymentReference}</p>
            )}
            <AdminSelect
              label="Update Payment"
              value={newPayment}
              onChange={(e) => setNewPayment(e.target.value)}
              options={PAYMENT_STATUSES}
            />
            <AdminButton
              className="mt-3 w-full"
              variant="secondary"
              loading={saving}
              onClick={handlePaymentSave}
              disabled={newPayment === order.paymentStatus}
            >
              Update Payment
            </AdminButton>
          </AdminCard>

          {order.fulfilledAt && (
            <AdminCard>
              <h3 className="text-gray-600 text-xs tracking-[0.12em] uppercase mb-2">Fulfilled</h3>
              <p className="text-gray-500 text-sm">{formatDateTime(order.fulfilledAt)}</p>
            </AdminCard>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}
