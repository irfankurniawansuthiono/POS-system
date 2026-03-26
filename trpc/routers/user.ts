import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { addUserSchema } from "@/lib/form-schema";
export const userRouter = createTRPCRouter({
  create: adminProcedure
    .input(addUserSchema)
    .mutation(async ({ input, ctx }) => {
      const res = await ctx.auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
      });

      await ctx.db.user.update({
        where: { id: res.user.id },
        data: { role: input.role },
      });

      return res.user;
    }),
  list: adminProcedure.query(async ({ ctx }) => {
    const users = (await ctx.db.user.findMany()).reverse();
    return users;
  }),
});
