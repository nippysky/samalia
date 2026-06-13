// src/actions/settings.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        siteName: "Sam'Aila",
        siteTagline: "",
        maintenanceMode: false,
        appointmentsEnabled: true,
        ordersEnabled: true,
      },
    });
  }
  return settings;
}

export async function updateSiteSettings(
  id: string,
  data: {
    siteName?: string;
    siteTagline?: string;
    siteDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    maintenanceMode?: boolean;
    maintenanceMessage?: string;
    appointmentsEnabled?: boolean;
    ordersEnabled?: boolean;
    logoPublicId?: string;
    logoSrc?: string;
  }
) {
  await requireAuth();
  const settings = await prisma.siteSettings.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, settings };
}

export async function getHomeFeatureLinks() {
  return prisma.homeFeatureLink.findMany({ orderBy: { order: "asc" } });
}

export async function upsertHomeFeatureLink(
  linkId: string | null,
  data: {
    title: string;
    subtitle?: string;
    href: string;
    imagePublicId: string;
    imageSrc: string;
    imageAlt: string;
    order?: number;
  }
) {
  await requireAuth();
  if (linkId) {
    await prisma.homeFeatureLink.update({ where: { id: linkId }, data });
  } else {
    const maxOrder = await prisma.homeFeatureLink.aggregate({ _max: { order: true } });
    await prisma.homeFeatureLink.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { success: true };
}

export async function deleteHomeFeatureLink(id: string) {
  await requireAuth();
  await prisma.homeFeatureLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { success: true };
}
