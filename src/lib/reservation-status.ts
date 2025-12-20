import type { ReservationStatus } from "@/types/reservation";

/**
 * 狀態轉換規則
 * 判斷「現在狀態 → 目標狀態」是否允許
 */
export function isStatusTransitionAllowed(
  currentStatus: ReservationStatus,
  targetStatus: ReservationStatus
): boolean {
  // 相同狀態不允許轉換
  if (currentStatus === targetStatus) {
    return false;
  }

  // 狀態轉換規則表
  const allowedTransitions: Record<ReservationStatus, ReservationStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED", "WAITLIST"],
    CONFIRMED: ["CANCELLED", "WAITLIST"],
    CANCELLED: [], // 已取消不可再轉換
    WAITLIST: ["CONFIRMED", "CANCELLED"],
  };

  return allowedTransitions[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * 驗證狀態是否為有效的 Enum 值
 */
export function isValidStatus(status: string): status is ReservationStatus {
  return ["PENDING", "CONFIRMED", "CANCELLED", "WAITLIST"].includes(status);
}






