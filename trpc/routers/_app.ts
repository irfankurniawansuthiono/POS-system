import { createTRPCRouter } from "@/trpc/init";
import { userRouter } from "./user";
import { categoryRouter } from "./category";
import { brandRouter } from "./brand";
import { supplierRouter } from "./supplier";
export const appRouter = createTRPCRouter({
  user: userRouter,
  category: categoryRouter,
  brand: brandRouter,
  supplier: supplierRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
