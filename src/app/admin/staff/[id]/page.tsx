import Link from "next/link";
import { getStaffById, getShiftsByStaffId } from "../data";
import { getReservations } from "../../reservations/data";
import StaffStatusTag from "../components/StaffStatusTag";
import StatusTag from "../../reservations/components/StatusTag";
import RoleBadge from "../components/RoleBadge";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(date.getDate() - date.getDay());
  return d;
}

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = getStaffById(id);
  const weekStart = getWeekStart(new Date());
  const shifts = getShiftsByStaffId(id);
  const allReservations = getReservations();

  // 取得本週的班表
  const weekShifts = shifts.filter((shift) => {
    const shiftDate = new Date(shift.date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  // 依日期排序
  const sortedShifts = [...weekShifts].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // 取得本週該人員的預約
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekReservations = allReservations.filter((r) => {
    const reservationDate = new Date(r.booking_date);
    return (
      r.staff === staff?.name &&
      reservationDate >= weekStart &&
      reservationDate <= weekEnd
    );
  });

  // 依時間由近到遠排序（日期 + 時間）
  const sortedReservations = [...weekReservations].sort((a, b) => {
    const dateCompare = a.booking_date.localeCompare(b.booking_date);
    if (dateCompare !== 0) return dateCompare;
    const timeA = a.booking_time_slot.split("-")[0];
    const timeB = b.booking_time_slot.split("-")[0];
    return timeA.localeCompare(timeB);
  });

  if (!staff) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/staff"
          className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 返回人員列表
        </Link>
        <p className="text-zinc-900">找不到此人員資料</p>
      </div>
    );
  }

  const weekDayNames: Record<string, string> = {
    Mon: "星期一",
    Tue: "星期二",
    Wed: "星期三",
    Thu: "星期四",
    Fri: "星期五",
    Sat: "星期六",
    Sun: "星期日",
  };

  const getDayName = (date: Date): string => {
    const dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return dayNames[date.getDay()];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 返回人員列表
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-black">人員詳情</h1>

      <div className="space-y-6">
        {/* 核心資料區 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            基本資料
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium text-zinc-700">姓名:</span>
              <p className="mt-1 text-sm text-zinc-900">{staff.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">
                員工編號:
              </span>
              <p className="mt-1 text-sm text-zinc-900">{staff.employee_id}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">職位:</span>
              <p className="mt-1 text-sm text-zinc-900">{staff.role}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">狀態:</span>
              <p className="mt-1">
                <StaffStatusTag status={staff.status} />
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">電話:</span>
              <p className="mt-1 text-sm text-zinc-900">{staff.phone}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-zinc-700">電子郵件:</span>
              <p className="mt-1 text-sm text-zinc-900">{staff.email}</p>
            </div>
          </div>
        </div>

        {/* 職位與權限 */}
        {"role_id" in staff && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              職位與權限
            </h2>
            <div>
              <RoleBadge
                roleName={
                  staff.role_id === "admin"
                    ? "Admin"
                    : staff.role_id === "staff"
                    ? "Staff"
                    : "Viewer"
                }
                roleNameZh={
                  staff.role_id === "admin"
                    ? "管理者"
                    : staff.role_id === "staff"
                    ? "員工"
                    : "檢視者"
                }
                roleId={staff.role_id}
              />
            </div>
          </div>
        )}

        {/* 可服務項目區 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            可服務項目
          </h2>
          <div className="flex flex-wrap gap-2">
            {staff.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* 本週班表摘要 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            本週班表摘要
          </h2>
          {sortedShifts.length === 0 ? (
            <p className="text-sm text-zinc-600">本週無排班</p>
          ) : (
            <div className="space-y-2">
              {sortedShifts.map((shift) => (
                <Link
                  key={shift.shift_id}
                  href={`/admin/staff/shifts/${shift.shift_id}`}
                  className="block p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900">
                      {weekDayNames[shift.day_of_week]}：
                    </span>
                    <span className="text-sm text-zinc-700">
                      {shift.start_time} - {shift.end_time} ({shift.shift_type})
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 本週行事曆摘要 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            本週行事曆摘要
          </h2>
          {sortedReservations.length === 0 ? (
            <p className="text-sm text-zinc-600">本週無預約</p>
          ) : (
            <div className="space-y-2">
              {sortedReservations.map((reservation) => {
                const reservationDate = new Date(reservation.booking_date);
                const dayName = getDayName(reservationDate);
                return (
                  <Link
                    key={reservation.reservation_id}
                    href={`/admin/reservations/${reservation.reservation_id}`}
                    className="block p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-zinc-900">
                            {reservation.booking_date} ({dayName})
                          </span>
                          <span className="text-sm text-zinc-700">
                            {reservation.booking_time_slot}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-600">
                          {reservation.service_item}
                        </p>
                      </div>
                      <StatusTag status={reservation.status} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

