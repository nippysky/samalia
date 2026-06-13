// src/actions/orders.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { orderStatusSchema } from "@/src/lib/validations";
import type { OrderStatus, PaymentStatus } from "@/src/generated/prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getOrders(opts?: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...(opts?.status && { status: opts.status }),
        ...(opts?.search && {
          OR: [
            { customerEmail: { contains: opts.search, mode: "insensitive" } },
            { customerName: { contains: opts.search, mode: "insensitive" } },
            { orderNumber: { contains: opts.search, mode: "insensitive" } },
          ],
        }),
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({
      where: {
        ...(opts?.status && { status: opts.status }),
      },
    }),
  ]);

  return { items, total, pages: Math.ceil(total / pageSize) };
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { name: true, images: { take: 1 } } } },
      },
    },
  });
}

export async function updateOrderStatus(id: string, data: unknown) {
  await requireAuth();
  const parsed = orderStatusSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      ...(parsed.data.status === "DELIVERED" && { fulfilledAt: new Date() }),
    },
  });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updatePaymentStatus(id: string, status: PaymentStatus) {
  await requireAuth();
  await prisma.order.update({ where: { id }, data: { paymentStatus: status } });
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getOrderStats() {
  const [total, pending, inProduction, shipped, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "IN_PRODUCTION" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);
  return {
    total,
    pending,
    inProduction,
    shipped,
    totalRevenue: totalRevenue._sum.total ?? 0,
  };
}
