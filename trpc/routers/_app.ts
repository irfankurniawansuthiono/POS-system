import { createTRPCRouter } from "@/trpc/init";
import { userRouter } from "./user";
import { categoryRouter } from "./category";
export const appRouter = createTRPCRouter({
  user: userRouter,
  category: categoryRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
