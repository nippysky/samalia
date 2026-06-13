// src/actions/products.ts
"use server";
import { auth } from "@/src/auth";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { productSchema, productVariantSchema } from "@/src/lib/validations";

async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function getProducts(opts?: {
  categorySlug?: string;
  featured?: boolean;
  available?: boolean;
  search?: string;
}) {
  return prisma.product.findMany({
    where: {
      ...(opts?.categorySlug && { categorySlug: opts.categorySlug }),
      ...(opts?.featured != null && { featured: opts.featured }),
      ...(opts?.available != null && { available: opts.available }),
      ...(opts?.search && {
        OR: [
          { name: { contains: opts.search, mode: "insensitive" } },
          { sku: { contains: opts.search, mode: "insensitive" } },
          { tags: { has: opts.search } },
        ],
      }),
    },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
    },
  });
}

export async function createProduct(
  data: unknown,
  images: { imagePublicId: string; src: string; alt: string; order: number }[],
  variants: unknown[]
) {
  await requireAuth();
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: {
        create: images.map((img, i) => ({
          imagePublicId: img.imagePublicId,
          src: img.src,
          alt: img.alt,
          imagePosition: "center",
          order: i,
        })),
      },
    },
  });

  // Create variants
  if (variants.length > 0) {
    const parsedVariants = variants.map((v) => productVariantSchema.parse(v));
    await prisma.productVariant.createMany({
      data: parsedVariants.map((v) => ({ ...v, productId: product.id })),
    });
  }

  revalidatePath("/ready-to-wear");
  revalidatePath("/admin/products");
  return { success: true, id: product.id };
}

export async function updateProduct(
  id: string,
  data: unknown,
  images?: { imagePublicId: string; src: string; alt: string; order: number }[]
) {
  await requireAuth();
  const parsed = productSchema.partial().safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await prisma.product.update({ where: { id }, data: parsed.data });

  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId: id,
        imagePublicId: img.imagePublicId,
        src: img.src,
        alt: img.alt,
        imagePosition: "center",
        order: i,
      })),
    });
  }

  revalidatePath("/ready-to-wear");
  revalidatePath(`/shop/${id}`);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAuth();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/ready-to-wear");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function upsertProductVariant(
  productId: string,
  variantId: string | null,
  data: unknown
) {
  await requireAuth();
  const parsed = productVariantSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  if (variantId) {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: parsed.data,
    });
  } else {
    await prisma.productVariant.create({
      data: { ...parsed.data, productId },
    });
  }
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductVariant(id: string) {
  await requireAuth();
  await prisma.productVariant.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function getInventorySummary() {
  const variants = await prisma.productVariant.findMany({
    include: { product: { select: { name: true, sku: true, categorySlug: true } } },
    orderBy: [{ stock: "asc" }],
  });
  return variants;
}
