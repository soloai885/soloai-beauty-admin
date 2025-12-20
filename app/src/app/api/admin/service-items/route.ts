import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

/**
 * Create Service API
 * POST /api/admin/service-items
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基本驗證
    if (!body.name || !body.category || body.price === undefined || body.duration === undefined) {
      return NextResponse.json(
        {
          error_code: "INVALID_INPUT",
          message: "name, category, price, and duration are required",
        },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description || null,
        price: body.price,
        duration: body.duration,
        bufferTime: body.bufferTime !== undefined ? body.bufferTime : 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error_code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * List Services API
 * GET /api/admin/service-items
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error_code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}



