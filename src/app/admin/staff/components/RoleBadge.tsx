import Link from "next/link";

interface RoleBadgeProps {
  roleName: string;
  roleNameZh: string;
  roleId?: string;
}

export default function RoleBadge({
  roleName,
  roleNameZh,
  roleId,
}: RoleBadgeProps) {
  const badge = (
    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
      {roleNameZh} | {roleName}
    </span>
  );

  if (roleId) {
    return (
      <Link href={`/admin/roles/${roleId}`} className="inline-block">
        {badge}
      </Link>
    );
  }

  return badge;
}



