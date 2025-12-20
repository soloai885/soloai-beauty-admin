export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "WAITLIST";

export interface ChangeStatusRequest {
  reservation_id: string;
  target_status: ReservationStatus;
}

export interface ChangeStatusResponse {
  reservation_id: string;
  status: ReservationStatus;
  updated_at: string;
}

export interface ErrorResponse {
  error_code: string;
  message: string;
}






