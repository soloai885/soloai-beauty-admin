"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RESERVATIONS_DATA,
  getServiceById,
  getStaffById,
} from "@/lib/mock-data";

export default function ReservationsPage() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary"; // Yellow-ish
      case "CONFIRMED":
        return "default"; // Primary color (Rose-700)
      case "COMPLETED":
        return "default"; // Primary color (Rose-700)
      case "CANCELLED":
        return "destructive"; // Red
      default:
        return "outline";
    }
  };


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

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">預約管理</h1>

      {/* Desktop 列表 */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>預約編號</TableHead>
              <TableHead>客戶姓名</TableHead>
              <TableHead>電話</TableHead>
              <TableHead>服務項目</TableHead>
              <TableHead>設計師</TableHead>
              <TableHead>日期 / 時間</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {RESERVATIONS_DATA.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-zinc-500">
                  尚無預約記錄
                </TableCell>
              </TableRow>
            ) : (
              RESERVATIONS_DATA.map((reservation) => {
                const service = getServiceById(reservation.serviceId);
                const staff = getStaffById(reservation.staffId);

                return (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      #{reservation.id}
                    </TableCell>
                    <TableCell>{reservation.customerName}</TableCell>
                    <TableCell className="text-zinc-600">
                      {reservation.customerPhone}
                    </TableCell>
                    <TableCell>
                      {service?.name || reservation.serviceId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={staff?.avatar}
                            alt={staff?.name}
                          />
                          <AvatarFallback>
                            {staff?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{staff?.name || reservation.staffId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{reservation.date}</div>
                      <div className="text-xs text-zinc-500">
                        {reservation.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getStatusBadgeVariant(reservation.status) as any
                        }
                        className={
                          reservation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : ""
                        }
                      >
                        {getStatusLabel(reservation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className="text-primary hover:underline"
                      >
                        查看詳情
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile 列表 */}
      <div className="block md:hidden space-y-4">
        {RESERVATIONS_DATA.map((reservation) => {
          const service = getServiceById(reservation.serviceId);
          const staff = getStaffById(reservation.staffId);

          return (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    #{reservation.id}
                  </h3>
                  <p className="text-sm text-zinc-900 mt-1">
                    {reservation.customerName}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {reservation.customerPhone}
                  </p>
                </div>
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
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-zinc-600">服務：</span>
                  <span className="text-zinc-900 ml-2">
                    {service?.name || reservation.serviceId}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600">設計師：</span>
                  <span className="text-zinc-900 ml-2">
                    {staff?.name || reservation.staffId}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-600">日期：</span>
                  <span className="text-zinc-900 ml-2">{reservation.date}</span>
                </div>
                <div>
                  <span className="text-zinc-600">時間：</span>
                  <span className="text-zinc-900 ml-2">{reservation.time}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-200">
                <Link
                  href={`/admin/reservations/${reservation.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  查看詳情 →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
