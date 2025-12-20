import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import StaffAvatar from "./StaffAvatar";

interface EventCardProps {
  reservationId: string;
  time: string;
  customerName: string;
  serviceItem: string;
  status: string;
  staff?: string | null;
  isMobile?: boolean;
}

export default function EventCard({
  reservationId,
  time,
  customerName,
  serviceItem,
  status,
  staff,
  isMobile = false,
}: EventCardProps) {
  const getStatusBorderColor = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "border-l-4 border-l-yellow-500";
      case "CONFIRMED":
        return "border-l-4 border-l-primary";
      case "COMPLETED":
        return "border-l-4 border-l-green-500";
      case "CANCELLED":
        return "border-l-4 border-l-red-500";
      default:
        return "border-l-4 border-l-gray-500";
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

  if (isMobile) {
    return (
      <Link
        href={`/admin/reservations/${reservationId}`}
        className="block bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-zinc-900">{time}</span>
              <Badge
                variant={getStatusBadgeVariant(status) as any}
                className={
                  status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : ""
                }
              >
                {getStatusLabel(status)}
              </Badge>
            </div>
            <p className="text-sm font-medium text-zinc-900 mb-1">
              {customerName}
            </p>
            <p className="text-sm text-zinc-600 truncate mb-2">{serviceItem}</p>
            <div className="mt-2">
              <StaffAvatar name={staff || null} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/admin/reservations/${reservationId}`}
      className={`block bg-white border border-zinc-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer ${getStatusBorderColor(
        status
      )}`}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-zinc-900">{time}</span>
          <Badge
            variant={getStatusBadgeVariant(status) as any}
            className={
              status === "PENDING"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : ""
            }
            style={{ fontSize: "0.65rem", padding: "0.125rem 0.375rem" }}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
        <p className="text-sm font-medium text-zinc-900 truncate">
          {customerName}
        </p>
        <p className="text-xs text-zinc-600 truncate">{serviceItem}</p>
        <div className="mt-1">
          <StaffAvatar name={staff || null} />
        </div>
      </div>
    </Link>
  );
}
