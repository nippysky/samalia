// src/actions/hero.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { heroSlideSchema } from "@/src/lib/validations";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getHeroSlides() {
  return prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
}

export async function createHeroSlide(data: unknown) {
  await requireAuth();
  const parsed = heroSlideSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
  await prisma.heroSlide.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}

export async function updateHeroSlide(id: string, data: unknown) {
  await requireAuth();
  const parsed = heroSlideSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.heroSlide.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}

export async function deleteHeroSlide(id: string) {
  await requireAuth();
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}

export async function reorderHeroSlides(orderedIds: string[]) {
  await requireAuth();
  await Promise.all(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({ where: { id }, data: { order: index } })
    )
  );
  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}
