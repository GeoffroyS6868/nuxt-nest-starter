import { isStaffRole, permissionsForRole, roleHasPermission } from "./staff-access";

describe("staff-access", () => {
  it("treats admin and editor as staff roles", () => {
    expect(isStaffRole("admin")).toBe(true);
    expect(isStaffRole("editor")).toBe(true);
    expect(isStaffRole(null)).toBe(false);
    expect(isStaffRole("member")).toBe(false);
  });

  it("grants all permissions to admin", () => {
    expect(permissionsForRole("admin")).toEqual(["users.manage", "content.manage"]);
    expect(roleHasPermission("admin", "users.manage")).toBe(true);
  });

  it("limits editor to content.manage", () => {
    expect(permissionsForRole("editor")).toEqual(["content.manage"]);
    expect(roleHasPermission("editor", "users.manage")).toBe(false);
  });
});
