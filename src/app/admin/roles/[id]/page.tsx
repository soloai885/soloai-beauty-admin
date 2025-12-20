import Link from "next/link";
import { getRoleById } from "../data";
import PermissionBadge from "../components/PermissionBadge";

const moduleNames: Record<string, string> = {
  dashboard: "儀表板",
  reservations: "預約管理",
  customers: "客戶",
  services: "服務項目",
  calendar: "行事曆",
  staff_scheduling: "人員排班",
  settings: "系統設定",
};

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = getRoleById(id);

  if (!role) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/roles"
          className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          ← 返回角色列表
        </Link>
        <p className="text-zinc-900">找不到此角色資料</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/roles"
        className="mb-4 inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        ← 返回角色列表
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-black">
        角色詳情：{role.role_name} ({role.role_name_zh})
      </h1>

      <div className="space-y-6">
        {/* 角色說明 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            角色說明
          </h2>
          <p className="text-sm text-zinc-700">{role.description}</p>
        </div>

        {/* 可存取模組清單 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">
            可存取模組清單
          </h2>
          <div className="space-y-3">
            {Object.entries(role.permissions).map(([module, accessLevel]) => (
              <div
                key={module}
                className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-zinc-900">
                  {moduleNames[module] || module}
                </span>
                <PermissionBadge
                  accessLevel={accessLevel as "view" | "full" | "no_access"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



