import { z } from "zod";
export const getBrandSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
  search: z.string().optional(),
  hasLogo: z.boolean().optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt"])
    .default("updatedAt")
    .optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
});

export const editStatusBrandSchema = z.object({
  id: z.string(),
  status: z.boolean(),
});

export const deleteBrandSchema = z.object({
  id: z.string(),
});
