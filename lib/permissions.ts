import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"; // if you want to merge default admin statements

const statements = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statements);

export const admin = ac.newRole({
  ...statements,
});
export const superadmin = ac.newRole({
  ...adminAc.statements,
  ...statements,
});

export default ac;
