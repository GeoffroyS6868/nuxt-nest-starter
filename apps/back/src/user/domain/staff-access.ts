/**
 * Staff access model:
 * - Permissions are what code checks.
 * - Roles are pre-configured permission bundles assigned on the user.
 */

import type {
  StaffPermission as ClientStaffPermission,
  StaffRole as ClientStaffRole,
} from "@starter/types";
import type { ApiErrorBody } from "@starter/utils";

export const STAFF_PERMISSIONS = ["users.manage", "content.manage"] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export const STAFF_ROLES = ["admin", "editor"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

/** Compile-time parity with `@starter/types` (workspace package smoke). */
type AssertExact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type _StaffPermissionParity = AssertExact<StaffPermission, ClientStaffPermission>;
type _StaffRoleParity = AssertExact<StaffRole, ClientStaffRole>;
const _staffPermissionParity: _StaffPermissionParity = true;
const _staffRoleParity: _StaffRoleParity = true;
void _staffPermissionParity;
void _staffRoleParity;

/** Compile-time link proving `@starter/utils` resolves in the Nest graph. */
export type NestLinkedApiErrorBody = ApiErrorBody;

export const ROLE_PERMISSIONS: Record<StaffRole, readonly StaffPermission[]> = {
  admin: STAFF_PERMISSIONS,
  editor: ["content.manage"],
};

export function isStaffRole(value: string | null | undefined): value is StaffRole {
  return value === "admin" || value === "editor";
}

export function permissionsForRole(role: StaffRole | null | undefined): readonly StaffPermission[] {
  if (!isStaffRole(role)) {
    return [];
  }

  switch (role) {
    case "admin":
      return ROLE_PERMISSIONS.admin;
    case "editor":
      return ROLE_PERMISSIONS.editor;
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function roleHasPermission(
  role: StaffRole | null | undefined,
  permission: StaffPermission,
): boolean {
  return permissionsForRole(role).includes(permission);
}

export function roleHasAnyPermission(
  role: StaffRole | null | undefined,
  permissions: readonly StaffPermission[],
): boolean {
  const granted = permissionsForRole(role);
  return permissions.some((permission) => granted.includes(permission));
}
