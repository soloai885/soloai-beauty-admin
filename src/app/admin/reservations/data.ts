import { mockReservations } from "./mock";

export type Reservation = typeof mockReservations[number];

export function getReservations(): Reservation[] {
  return mockReservations;
}

export function getReservationById(id: string): Reservation | undefined {
  return mockReservations.find(
    (r) => r.reservation_id === Number(id)
  );
}

export function updateReservationStatus(
  id: string,
  newStatus: "已確認" | "已取消"
): boolean {
  const reservation = mockReservations.find(
    (r) => r.reservation_id === Number(id)
  );
  
  if (!reservation) {
    return false;
  }
  
  // 狀態規則：只有「待確認」可以變更
  if (reservation.status !== "待確認") {
    return false;
  }
  
  reservation.status = newStatus;
  return true;
}

