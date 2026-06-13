// src/actions/house.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getHouseContent() {
  let content = await prisma.houseContent.findFirst({
    include: { sections: { orderBy: { order: "asc" } } },
  });

  // Seed if missing
  if (!content) {
    content = await prisma.houseContent.create({
      data: {
        heroTitle: "The House",
        heroSubtitle: "",
        heroImagePublicId: "",
        heroImageSrc: "",
        heroImageAlt: "",
        overviewTitle: "",
        overviewBody: "",
      },
      include: { sections: true },
    });
  }
  return content;
}

export async function updateHouseContent(
  id: string,
  data: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImagePublicId?: string;
    heroImageSrc?: string;
    heroImageAlt?: string;
    overviewTitle?: string;
    overviewBody?: string;
  }
) {
  await requireAuth();
  await prisma.houseContent.update({ where: { id }, data });
  revalidatePath("/the-house");
  revalidatePath("/admin/house");
  return { success: true };
}

export async function upsertHouseSection(
  contentId: string,
  sectionId: string | null,
  data: {
    title: string;
    subtitle?: string;
    body: string;
    imagePublicId?: string;
    imageSrc?: string;
    imageAlt?: string;
    imagePosition?: string;
    order?: number;
  }
) {
  await requireAuth();
  if (sectionId) {
    await prisma.houseSection.update({ where: { id: sectionId }, data });
  } else {
    const maxOrder = await prisma.houseSection.aggregate({
      where: { contentId },
      _max: { order: true },
    });
    await prisma.houseSection.create({
      data: { ...data, contentId, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }
  revalidatePath("/the-house");
  revalidatePath("/admin/house");
  return { success: true };
}

export async function deleteHouseSection(id: string) {
  await requireAuth();
  await prisma.houseSection.delete({ where: { id } });
  revalidatePath("/the-house");
  revalidatePath("/admin/house");
  return { success: true };
}
