// src/actions/craft.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getCraftContent() {
  let content = await prisma.craftContent.findFirst({
    include: {
      editorialImages: { orderBy: { order: "asc" } },
      principles: { orderBy: { order: "asc" } },
    },
  });

  if (!content) {
    content = await prisma.craftContent.create({
      data: {
        heroTitle: "Craft & Legacy",
        heroSubtitle: "",
        heroImagePublicId: "",
        heroImageSrc: "",
        heroImageAlt: "",
        introHeading: "",
        introBody: "",
        principlesHeading: "",
      },
      include: { editorialImages: true, principles: true },
    });
  }
  return content;
}

export async function updateCraftContent(
  id: string,
  data: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImagePublicId?: string;
    heroImageSrc?: string;
    heroImageAlt?: string;
    introHeading?: string;
    introBody?: string;
    principlesHeading?: string;
  }
) {
  await requireAuth();
  await prisma.craftContent.update({ where: { id }, data });
  revalidatePath("/craft-legacy");
  revalidatePath("/admin/craft");
  return { success: true };
}

export async function upsertCraftEditorialImage(
  contentId: string,
  imageId: string | null,
  data: {
    imagePublicId: string;
    imageSrc: string;
    imageAlt: string;
    caption?: string;
    order?: number;
  }
) {
  await requireAuth();
  if (imageId) {
    await prisma.craftEditorialImage.update({ where: { id: imageId }, data });
  } else {
    const maxOrder = await prisma.craftEditorialImage.aggregate({
      where: { contentId },
      _max: { order: true },
    });
    await prisma.craftEditorialImage.create({
      data: { ...data, contentId, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }
  revalidatePath("/craft-legacy");
  revalidatePath("/admin/craft");
  return { success: true };
}

export async function deleteCraftEditorialImage(id: string) {
  await requireAuth();
  await prisma.craftEditorialImage.delete({ where: { id } });
  revalidatePath("/craft-legacy");
  revalidatePath("/admin/craft");
  return { success: true };
}

export async function upsertCraftPrinciple(
  contentId: string,
  principleId: string | null,
  data: { title: string; body: string; order?: number }
) {
  await requireAuth();
  if (principleId) {
    await prisma.craftPrinciple.update({ where: { id: principleId }, data });
  } else {
    const maxOrder = await prisma.craftPrinciple.aggregate({
      where: { contentId },
      _max: { order: true },
    });
    await prisma.craftPrinciple.create({
      data: { ...data, contentId, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }
  revalidatePath("/craft-legacy");
  revalidatePath("/admin/craft");
  return { success: true };
}

export async function deleteCraftPrinciple(id: string) {
  await requireAuth();
  await prisma.craftPrinciple.delete({ where: { id } });
  revalidatePath("/craft-legacy");
  revalidatePath("/admin/craft");
  return { success: true };
}
