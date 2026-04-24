import { createTRPCRouter } from "@/trpc/init";
import { appConfigRouter } from "./appConfig";
import { brandRouter } from "./brand";
import { categoryRouter } from "./category";
import { supplierRouter } from "./supplier";
import { userRouter } from "./user";
export const appRouter = createTRPCRouter({
    user: userRouter,
    category: categoryRouter,
    brand: brandRouter,
    supplier: supplierRouter,
    appConfig: appConfigRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
