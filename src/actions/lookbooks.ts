// src/actions/lookbooks.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { lookbookSchema, lookbookLookSchema } from "@/src/lib/validations";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getLookbooks(publishedOnly = false) {
  return prisma.lookbook.findMany({
    where: publishedOnly ? { isPublished: true } : undefined,
    include: {
      looks: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getLookbookBySlug(slug: string) {
  return prisma.lookbook.findUnique({
    where: { slug },
    include: {
      looks: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });
}

export async function createLookbook(
  data: unknown,
  looks: unknown[],
  gallery: { imagePublicId: string; imageSrc: string; imageAlt: string }[]
) {
  await requireAuth();
  const parsed = lookbookSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const parsedLooks = looks.map((l) => lookbookLookSchema.parse(l));

  const lookbook = await prisma.lookbook.create({
    data: {
      ...parsed.data,
      looks: {
        create: parsedLooks.map((l, i) => ({
          lookNumber: l.lookNumber,
          title: l.title,
          category: l.category,
          description: l.description,
          imagePublicId: l.imagePublicId,
          imageSrc: l.imageSrc,
          imageAlt: l.imageAlt,
          imagePosition: l.imagePosition,
          order: i,
        })),
      },
      gallery: {
        create: gallery.map((g, i) => ({
          imagePublicId: g.imagePublicId,
          imageSrc: g.imageSrc,
          imageAlt: g.imageAlt,
          imagePosition: "center",
          order: i,
        })),
      },
    },
  });

  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true, id: lookbook.id };
}

export async function updateLookbook(id: string, data: unknown) {
  await requireAuth();
  const parsed = lookbookSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.lookbook.update({ where: { id }, data: parsed.data });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

export async function deleteLookbook(id: string) {
  await requireAuth();
  await prisma.lookbook.delete({ where: { id } });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

export async function toggleLookbookPublished(id: string, isPublished: boolean) {
  await requireAuth();
  await prisma.lookbook.update({ where: { id }, data: { isPublished } });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

export async function addLookbookLook(lookbookId: string, data: unknown) {
  await requireAuth();
  const parsed = lookbookLookSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const maxOrder = await prisma.lookbookLook.aggregate({
    where: { lookbookId },
    _max: { order: true },
  });

  await prisma.lookbookLook.create({
    data: { ...parsed.data, lookbookId, order: (maxOrder._max.order ?? -1) + 1 },
  });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

export async function deleteLookbookLook(id: string) {
  await requireAuth();
  await prisma.lookbookLook.delete({ where: { id } });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

// ── Gallery images ────────────────────────────────────────────────

export async function addGalleryImage(
  lookbookId: string,
  data: { imagePublicId: string; imageSrc: string; imageAlt: string }
) {
  await requireAuth();
  const maxOrder = await prisma.lookbookGalleryImage.aggregate({
    where: { lookbookId },
    _max: { order: true },
  });
  await prisma.lookbookGalleryImage.create({
    data: {
      lookbookId,
      imagePublicId: data.imagePublicId,
      imageSrc: data.imageSrc,
      imageAlt: data.imageAlt ?? "",
      imagePosition: "center",
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  await requireAuth();
  await prisma.lookbookGalleryImage.delete({ where: { id } });
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbooks");
  return { success: true };
}
