// src/actions/journal.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { journalArticleSchema } from "@/src/lib/validations";
import type { JournalBlockType } from "@/src/generated/prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getJournalArticles(publishedOnly = false) {
  return prisma.journalArticle.findMany({
    where: publishedOnly ? { published: true } : undefined,
    include: {
      blocks: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getJournalArticleBySlug(slug: string) {
  return prisma.journalArticle.findUnique({
    where: { slug },
    include: {
      blocks: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });
}

export async function getJournalArticleById(id: string) {
  return prisma.journalArticle.findUnique({
    where: { id },
    include: {
      blocks: { orderBy: { order: "asc" } },
      gallery: { orderBy: { order: "asc" } },
    },
  });
}

export async function createJournalArticle(data: unknown) {
  await requireAuth();
  const parsed = journalArticleSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const article = await prisma.journalArticle.create({ data: parsed.data });
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  return { success: true, id: article.id };
}

export async function updateJournalArticle(id: string, data: unknown) {
  await requireAuth();
  const parsed = journalArticleSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.journalArticle.update({ where: { id }, data: parsed.data });
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function deleteJournalArticle(id: string) {
  await requireAuth();
  await prisma.journalArticle.delete({ where: { id } });
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function addJournalBlock(
  articleId: string,
  type: JournalBlockType,
  content: string,
  imagePublicId?: string,
  imageSrc?: string,
  imageAlt?: string
) {
  await requireAuth();
  const maxOrder = await prisma.journalBlock.aggregate({
    where: { articleId },
    _max: { order: true },
  });
  await prisma.journalBlock.create({
    data: {
      articleId,
      type,
      content,
      imagePublicId,
      imageSrc,
      imageAlt,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function updateJournalBlock(
  id: string,
  data: { content?: string; imagePublicId?: string; imageSrc?: string; imageAlt?: string }
) {
  await requireAuth();
  await prisma.journalBlock.update({ where: { id }, data });
  revalidatePath("/journal");
  return { success: true };
}

export async function deleteJournalBlock(id: string) {
  await requireAuth();
  await prisma.journalBlock.delete({ where: { id } });
  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  return { success: true };
}

export async function addJournalGalleryImage(
  articleId: string,
  imagePublicId: string,
  imageSrc: string,
  imageAlt: string
) {
  await requireAuth();
  const maxOrder = await prisma.journalGalleryImage.aggregate({
    where: { articleId },
    _max: { order: true },
  });
  await prisma.journalGalleryImage.create({
    data: {
      articleId,
      imagePublicId,
      imageSrc,
      imageAlt,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/journal");
  return { success: true };
}
