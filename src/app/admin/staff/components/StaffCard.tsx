import Link from "next/link";
import StaffStatusTag from "./StaffStatusTag";

interface StaffCardProps {
  staffId: number;
  name: string;
  role: string;
  services: string[];
  status: string;
  isMobile?: boolean;
}

export default function StaffCard({
  staffId,
  name,
  role,
  services,
  status,
  isMobile = false,
}: StaffCardProps) {
  const servicesText =
    services.length > 0
      ? services.length === 1
        ? services[0]
        : `${services[0]} + ${services.length - 1} 項`
      : "無";

  if (isMobile) {
    return (
      <Link
        href={`/admin/staff/${staffId}`}
        className="block bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-zinc-900">{name}</h3>
              <StaffStatusTag status={status} />
            </div>
            <p className="text-sm text-zinc-600 mb-2">{role}</p>
            <p className="text-sm text-zinc-700">
              <span className="font-medium">可服務項目：</span>
              {servicesText}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/admin/staff/${staffId}`}
      className="block bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900">{name}</h3>
          <StaffStatusTag status={status} />
        </div>
        <p className="text-sm text-zinc-600">{role}</p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">可服務項目：</span>
          {servicesText}
        </p>
      </div>
    </Link>
  );
}






