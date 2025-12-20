import Link from "next/link";

interface RoleCardProps {
  roleId: string;
  roleName: string;
  roleNameZh: string;
  description: string;
  actionSummary: string[];
  staffCount: number;
  isMobile?: boolean;
}

export default function RoleCard({
  roleId,
  roleName,
  roleNameZh,
  description,
  actionSummary,
  staffCount,
  isMobile = false,
}: RoleCardProps) {
  if (isMobile) {
    return (
      <Link
        href={`/admin/roles/${roleId}`}
        className="block bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">
              {roleNameZh}
            </h3>
            <p className="text-sm text-zinc-600">{roleName}</p>
          </div>
          <p className="text-sm text-zinc-700">{description}</p>
          <div className="space-y-1">
            {actionSummary.map((action, index) => (
              <p key={index} className="text-xs text-zinc-600">
                • {action}
              </p>
            ))}
          </div>
          <p className="text-sm text-zinc-600 mt-2">
            共 {staffCount} 位人員擁有此角色
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/admin/roles/${roleId}`}
      className="block bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 mb-1">
            {roleNameZh}
          </h3>
          <p className="text-sm text-zinc-600">{roleName}</p>
        </div>
        <p className="text-sm text-zinc-700">{description}</p>
        <div className="space-y-1">
          {actionSummary.map((action, index) => (
            <p key={index} className="text-xs text-zinc-600">
              • {action}
            </p>
          ))}
        </div>
        <p className="text-sm text-zinc-600 mt-4">
          共 {staffCount} 位人員擁有此角色
        </p>
      </div>
    </Link>
  );
}



