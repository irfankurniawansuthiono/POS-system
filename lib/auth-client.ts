import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { superadmin, admin as adminRole } from "./permissions";
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  changePassword,
  resetPassword,
  requestPasswordReset,
  admin,
} = createAuthClient({
  plugins: [
    adminClient({
      roles: {
        adminRole,
        superadmin,
      },
    }),
  ],
});
