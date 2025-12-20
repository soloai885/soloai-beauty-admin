"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeReservationStatus } from "@/lib/api/reservations";
import type { ReservationStatus } from "@/types/reservation";

interface StatusActionsProps {
  reservationId: string;
  currentStatus: string;
}

// 中文狀態 → 英文 Enum 映射
const statusToEnum: Record<string, ReservationStatus> = {
  待確認: "PENDING",
  已確認: "CONFIRMED",
  已取消: "CANCELLED",
  候補中: "WAITLIST",
};

// 英文 Enum → 中文狀態映射
const enumToStatus: Record<ReservationStatus, string> = {
  PENDING: "待確認",
  CONFIRMED: "已確認",
  CANCELLED: "已取消",
  WAITLIST: "候補中",
};

export default function StatusActions({
  reservationId,
  currentStatus,
}: StatusActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (targetStatus: ReservationStatus) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await changeReservationStatus(reservationId, targetStatus);

      if ("error_code" in result) {
        // 失敗：顯示錯誤訊息
        setError(result.message);
      } else {
        // 成功：重新載入頁面以顯示最新狀態
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 只有 PENDING 狀態才顯示操作按鈕
  const currentEnum = statusToEnum[currentStatus] || "PENDING";
  if (currentEnum !== "PENDING") {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange("CONFIRMED")}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          確認預約
        </button>
        <button
          onClick={() => handleStatusChange("CANCELLED")}
          disabled={isSubmitting}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          取消預約
        </button>
        <button
          onClick={() => handleStatusChange("WAITLIST")}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          轉為候補
        </button>
      </div>
    </div>
  );
}






