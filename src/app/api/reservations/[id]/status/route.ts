import { NextRequest, NextResponse } from "next/server";
import type {
  ChangeStatusRequest,
  ChangeStatusResponse,
  ErrorResponse,
  ReservationStatus,
} from "@/types/reservation";
import { mockReservations } from "@/app/admin/reservations/mock";
import {
  isStatusTransitionAllowed,
  isValidStatus,
} from "@/lib/reservation-status";

/**
 * Change Reservation Status API
 * POST /api/reservations/[id]/status
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: ChangeStatusRequest = await request.json();

    // Step 1: 輸入驗證（Input Validation）
    if (!body.reservation_id || !body.target_status) {
      return NextResponse.json<ErrorResponse>(
        {
          error_code: "INVALID_INPUT",
          message: "reservation_id and target_status are required",
        },
        { status: 400 }
      );
    }

    if (body.reservation_id !== id) {
      return NextResponse.json<ErrorResponse>(
        {
          error_code: "ID_MISMATCH",
          message: "reservation_id in body does not match URL parameter",
        },
        { status: 400 }
      );
    }

    if (!isValidStatus(body.target_status)) {
      return NextResponse.json<ErrorResponse>(
        {
          error_code: "INVALID_STATUS",
          message: "target_status must be one of: PENDING, CONFIRMED, CANCELLED, WAITLIST",
        },
        { status: 400 }
      );
    }

    // Step 2: 讀取現有狀態（Source of Truth）
    const reservation = mockReservations.find(
      (r) => r.reservation_id === Number(id)
    );

    if (!reservation) {
      return NextResponse.json<ErrorResponse>(
        {
          error_code: "RESERVATION_NOT_FOUND",
          message: `Reservation with id ${id} not found`,
        },
        { status: 404 }
      );
    }

    // 將中文狀態轉換為英文 Enum（僅用於內部邏輯）
    const statusMap: Record<string, ReservationStatus> = {
      待確認: "PENDING",
      已確認: "CONFIRMED",
      已取消: "CANCELLED",
      候補中: "WAITLIST",
    };

    const currentStatus: ReservationStatus =
      statusMap[reservation.status] || "PENDING";

    // Step 3: 狀態轉換合法性判斷
    if (!isStatusTransitionAllowed(currentStatus, body.target_status)) {
      return NextResponse.json<ErrorResponse>(
        {
          error_code: "TRANSITION_NOT_ALLOWED",
          message: `Cannot transition from ${currentStatus} to ${body.target_status}`,
        },
        { status: 400 }
      );
    }

    // Step 4: 寫入狀態（模擬 Transaction）
    // 在實際 DB 中，這應該包在 transaction 內
    const statusReverseMap: Record<ReservationStatus, string> = {
      PENDING: "待確認",
      CONFIRMED: "已確認",
      CANCELLED: "已取消",
      WAITLIST: "候補中",
    };

    reservation.status = statusReverseMap[body.target_status];
    const updatedAt = new Date().toISOString();

    // Step 5: 回傳結果
    const response: ChangeStatusResponse = {
      reservation_id: id,
      status: body.target_status,
      updated_at: updatedAt,
    };

    return NextResponse.json<ChangeStatusResponse>(response, { status: 200 });
  } catch (error) {
    // 錯誤處理：任一階段失敗 → rollback（在實際 DB 中）
    return NextResponse.json<ErrorResponse>(
      {
        error_code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}






