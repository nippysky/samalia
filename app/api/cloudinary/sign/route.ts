// app/api/cloudinary/sign/route.ts
// Returns a signed Cloudinary upload signature for client-side direct uploads

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { generateUploadSignature } from "@/src/lib/cloudinary";

export async function POST(req: NextRequest) {
  // Only authenticated admins can generate upload signatures
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { folder = "samalia", publicId, timestamp } = body;

  const ts = timestamp ?? Math.round(new Date().getTime() / 1000);

  const paramsToSign: Record<string, unknown> = {
    timestamp: ts,
    folder,
  };
  if (publicId) paramsToSign.public_id = publicId;

  const signature = generateUploadSignature(paramsToSign);

  return NextResponse.json({
    signature,
    timestamp: ts,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
