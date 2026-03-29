export const role = {
  superadmin: "superadmin",
  admin: "admin",
  cashier: "cashier",
  warehouse: "warehouse",
  finance: "finance",
  user: "user",
} as const;

export type RoleUser = (typeof role)[keyof typeof role];

export const roleList = Object.values(role);
