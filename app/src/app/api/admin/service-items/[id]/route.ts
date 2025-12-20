import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

/**
 * Get Service by ID API
 * GET /api/admin/service-items/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: {
        id: id,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          error_code: "NOT_FOUND",
          message: `Service with id ${id} not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(service, { status: 200 });
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
 * Update Service API
 * PUT /api/admin/service-items/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 檢查是否存在
    const existing = await prisma.service.findUnique({
      where: { id: id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          error_code: "NOT_FOUND",
          message: `Service with id ${id} not found`,
        },
        { status: 404 }
      );
    }

    // 更新資料
    const service = await prisma.service.update({
      where: {
        id: id,
      },
      data: {
        name: body.name || existing.name,
        category: body.category || existing.category,
        description: body.description !== undefined ? body.description : existing.description,
        price: body.price !== undefined ? body.price : existing.price,
        duration: body.duration !== undefined ? body.duration : existing.duration,
        bufferTime: body.bufferTime !== undefined ? body.bufferTime : existing.bufferTime,
        isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
      },
    });

    return NextResponse.json(service, { status: 200 });
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



