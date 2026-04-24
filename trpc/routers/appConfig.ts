import { createTRPCRouter, publicProcedure } from "@/trpc/init";
export const appConfigRouter = createTRPCRouter({
    get: publicProcedure.query(async ({ ctx }) => {
        const appConfig = await ctx.db.appConfig.findFirst();
        return appConfig;
    }),
});
