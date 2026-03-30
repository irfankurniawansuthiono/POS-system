import { z } from "zod";

export const deleteCategorySchema = z.object({
  id: z.string(),
});

export const editParentCategorySchema = z.object({
  id: z.string(),
  parentId: z.string(),
});
