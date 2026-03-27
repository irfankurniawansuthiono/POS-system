// lib/permissions.ts
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  _: ["_"], // dummy, hapus nanti kalau sudah ada real permissions
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({});
const admin = ac.newRole({ _: ["_"] });
const cashier = ac.newRole({});
const warehouse = ac.newRole({});
const finance = ac.newRole({});

export { ac, user, admin, cashier, warehouse, finance };
