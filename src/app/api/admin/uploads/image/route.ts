import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

/**
 * Upload Image API
 * POST /api/admin/uploads/image
 */
export async function POST(request: NextRequest) {
  try {
    // 檢查 BLOB_READ_WRITE_TOKEN
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error_code: "CONFIG_ERROR",
          message: "BLOB_READ_WRITE_TOKEN is not configured",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error_code: "INVALID_INPUT",
          message: "File is required",
        },
        { status: 400 }
      );
    }

    // 上傳到 Vercel Blob
    const blob = await put(`service-items/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: token,
    });

    return NextResponse.json({ url: blob.url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error_code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}



