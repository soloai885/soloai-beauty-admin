import type {
  ChangeStatusRequest,
  ChangeStatusResponse,
  ErrorResponse,
  ReservationStatus,
} from "@/types/reservation";

export async function changeReservationStatus(
  reservationId: string,
  targetStatus: ReservationStatus
): Promise<ChangeStatusResponse | ErrorResponse> {
  const response = await fetch(
    `/api/reservations/${reservationId}/status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservation_id: reservationId,
        target_status: targetStatus,
      } as ChangeStatusRequest),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return data as ErrorResponse;
  }

  return data as ChangeStatusResponse;
}






