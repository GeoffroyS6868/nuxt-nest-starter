import type { StaffPermission, User } from "@starter/types";

export function isStaffUser(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }
  if (user.role === "admin" || user.role === "editor") {
    return true;
  }
  return (user.permissions?.length ?? 0) > 0;
}

export function hasPermission(user: User | null | undefined, permission: StaffPermission): boolean {
  return user?.permissions?.includes(permission) === true;
}
