import Link from "next/link";
import { getReservationById } from "../data";
import StatusActions from "./components/StatusActions";

function getStatusStyle(status: string) {
  switch (status) {
    case "待確認":
      return "bg-yellow-100 text-yellow-800";
    case "已確認":
      return "bg-blue-100 text-blue-800";
    case "已取消":
      return "bg-red-100 text-red-800";
    case "候補中":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = getReservationById(id);

  if (!reservation) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/reservations"
          className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 返回列表
        </Link>
        <p className="text-zinc-900">找不到此預約資料</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/reservations"
        className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 返回列表
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-black">
        預約詳細資料
      </h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm font-medium text-zinc-700">
              預約編號:
            </span>
            <p className="mt-1 text-sm text-zinc-900">
              #{reservation.reservation_id}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-zinc-700">
              預約狀態:
            </span>
            <div className="mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                  reservation.status
                )}`}
              >
                {reservation.status}
              </span>
              <StatusActions
                reservationId={id}
                currentStatus={reservation.status}
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">客戶姓名:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.customer_name}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">聯絡電話:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.customer_phone}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">服務項目:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.service_item}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">日期 / 時段:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.booking_date} {reservation.booking_time_slot}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-700">來源:</span>
            <p className="mt-1 text-sm text-zinc-900">{reservation.source}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-zinc-700">備註:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.note || "(空)"}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-zinc-700">建立時間:</span>
            <p className="mt-1 text-sm text-zinc-900">
              {reservation.created_at}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
