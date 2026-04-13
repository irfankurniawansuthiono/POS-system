import { z } from "zod";
export const getSupplierSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
  search: z.string().optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "updatedAt"])
    .default("updatedAt")
    .optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});
