import { mockRoles } from "./mock";
import { mockStaff } from "../staff/mock";

export type Role = typeof mockRoles[number];

export function getRoles(): Role[] {
  return mockRoles;
}

export function getRoleById(id: string): Role | undefined {
  return mockRoles.find((r) => r.role_id === id);
}

export function getStaffCountByRole(roleId: string): number {
  return mockStaff.filter((s) => "role_id" in s && s.role_id === roleId).length;
}

