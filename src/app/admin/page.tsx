"use client";

import Link from "next/link";
import { RESERVATIONS_DATA, getServiceById } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  // 計算 KPI
  const today = new Date().toISOString().split("T")[0];
  
  // 今日營收：加總所有狀態為 CONFIRMED 或 COMPLETED 的訂單金額
  const totalRevenue = RESERVATIONS_DATA
    .filter(
      (r) => r.status === "CONFIRMED" || r.status === "COMPLETED"
    )
    .reduce((sum, r) => sum + r.price, 0);

  // 預約總數
  const totalAppointments = RESERVATIONS_DATA.length;

  // 待確認數量
  const pendingCount = RESERVATIONS_DATA.filter(
    (r) => r.status === "PENDING"
  ).length;

  // 在職人員數（從 STAFF_DATA 取得，但這裡我們先使用固定值，因為沒有在 mock-data 中匯出）
  const activeStaff = 4; // 暫時固定值

  // 近期預約列表（前 5 筆）
  const recentReservations = RESERVATIONS_DATA.slice(0, 5);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "待確認";
      case "CONFIRMED":
        return "已確認";
      case "COMPLETED":
        return "已完成";
      case "CANCELLED":
        return "已取消";
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "CONFIRMED":
      case "COMPLETED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">今日營收</p>
              <p className="text-2xl font-semibold text-zinc-900">
                NT$ {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">預約總數</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {totalAppointments}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">待確認</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {pendingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600 mb-1">在職人員</p>
              <p className="text-2xl font-semibold text-zinc-900">
                {activeStaff}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">最近預約</h2>
            <Link
              href="/admin/reservations"
              className="text-sm text-primary hover:underline"
            >
              查看全部 →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentReservations.map((reservation) => {
              const service = getServiceById(reservation.serviceId);
              return (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">
                      {reservation.customerName}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {service?.name || reservation.serviceId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-900">
                      {reservation.date} {reservation.time}
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(reservation.status) as any}
                      className={
                        reservation.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : ""
                      }
                    >
                      {getStatusLabel(reservation.status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
