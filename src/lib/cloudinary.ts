// src/lib/cloudinary.ts
// Cloudinary server-side configuration

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

// ── Upload helpers ────────────────────────────────────────────────

export type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

/** Upload a file from a buffer (server-side usage) */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: Record<string, unknown>[];
  } = {}
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder ?? "samalia",
          public_id: options.publicId,
          resource_type: "auto",
          quality: "auto:best",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      )
      .end(buffer);
  });
}

/** Delete an asset from Cloudinary */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/** Generate a signed upload signature for client-side direct uploads */
export function generateUploadSignature(
  paramsToSign: Record<string, unknown>
): string {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
}

// ── Cloudinary URL builder ────────────────────────────────────────

export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | "auto";
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
): string {
  const { width, height, quality = "auto", format = "auto", crop = "fill", gravity = "auto" } = options;

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    crop && `c_${crop}`,
    gravity && `g_${gravity}`,
    width && `w_${width}`,
    height && `h_${height}`,
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}
