export type StaffRole = "admin" | "editor";

export type StaffPermission = "users.manage" | "content.manage";

export interface User {
  id: string;
  role?: StaffRole | null;
  permissions?: StaffPermission[];
  /** Convenience flag when role is admin. */
  admin?: boolean;
  email: string;
  userName: string;
  avatarUrl: string | null;
}
