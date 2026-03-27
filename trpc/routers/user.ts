import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { addUserSchema } from "@/lib/form-schema";
import { getUserSchema } from "@/lib/query-schema/get-user";

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
  list: adminProcedure.input(getUserSchema).query(async ({ ctx, input }) => {
    const currentPage = input.page || 1;
    const limit = input.limit || 10;
    const search = input.search || "";
    const skip = (currentPage - 1) * limit;
    const userTotal = await ctx.db.user.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    const users = await ctx.db.user.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    const hasNextPage = skip + users.length < userTotal;
    const hasPreviousPage = skip > 0;
    const totalPages = Math.ceil(userTotal / limit);
    const meta = {
      total: userTotal,
      currentPage,
      limit,
      hasNextPage,
      hasPreviousPage,
      totalPages,
      nextPage: hasNextPage ? currentPage + 1 : null,
      previousPage: hasPreviousPage ? currentPage - 1 : null,
    };

    return { users, meta };
  }),
});
