import { getRoles } from "./data";
import RoleCard from "./components/RoleCard";

export default function RolesOverviewPage() {
  const roles = getRoles();

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        角色管理 (Roles)
      </h1>

      {/* Desktop/Tablet: 卡片網格 */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <RoleCard
            key={role.role_id}
            roleId={role.role_id}
            roleName={role.role_name}
            roleNameZh={role.role_name_zh}
            description={role.description}
            actionSummary={role.action_summary}
            staffCount={role.staff_count}
          />
        ))}
      </div>

      {/* Mobile: 垂直堆疊卡片列表 */}
      <div className="md:hidden space-y-4">
        {roles.map((role) => (
          <RoleCard
            key={role.role_id}
            roleId={role.role_id}
            roleName={role.role_name}
            roleNameZh={role.role_name_zh}
            description={role.description}
            actionSummary={role.action_summary}
            staffCount={role.staff_count}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  );
}



