// src/actions/appointments.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { appointmentStatusSchema } from "@/src/lib/validations";
import type { AppointmentStatus, AppointmentType } from "@/src/generated/prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getAppointments(opts?: {
  status?: AppointmentStatus;
  type?: AppointmentType;
  page?: number;
  pageSize?: number;
}) {
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;

  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        ...(opts?.status && { status: opts.status }),
        ...(opts?.type && { type: opts.type }),
      },
      orderBy: { scheduledAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.appointment.count({
      where: {
        ...(opts?.status && { status: opts.status }),
        ...(opts?.type && { type: opts.type }),
      },
    }),
  ]);

  return { items, total, pages: Math.ceil(total / pageSize) };
}

export async function getAppointmentById(id: string) {
  return prisma.appointment.findUnique({ where: { id } });
}

export async function updateAppointmentStatus(id: string, data: unknown) {
  await requireAuth();
  const parsed = appointmentStatusSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.appointment.update({
    where: { id },
    data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes },
  });
  revalidatePath("/admin/appointments");
  return { success: true };
}

export async function getAppointmentStats() {
  const [total, pending, confirmed, completed] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
  ]);
  return { total, pending, confirmed, completed };
}
