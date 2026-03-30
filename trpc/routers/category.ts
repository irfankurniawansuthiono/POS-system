import { createTRPCRouter, withRole } from "@/trpc/init";
import { addCategorySchema, editCategorySchema } from "@/lib/form-schema";
import {
  deleteCategorySchema,
  editParentCategorySchema,
} from "@/lib/query-schema/category-schema-api";

export const categoryRouter = createTRPCRouter({
  create: withRole("superadmin", "admin")
    .input(addCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const parentIndex = await ctx.db.category.findUnique({
        where: {
          id: input.parentId,
        },
        select: {
          categoryIndex: true,
        },
      });
      if (parentIndex) {
        if (parentIndex.categoryIndex + 1 > 4)
          throw new Error("You cannot add more than 5 categories");
        const newCategory = await ctx.db.category.create({
          data: {
            name: input.name,
            categoryIndex: parentIndex.categoryIndex + 1 || 0,
            parentId: input.parentId,
          },
        });
        return newCategory;
      } else {
        throw new Error("Parent category not found");
      }
    }),
  editParentId: withRole("superadmin", "admin")
    .input(editParentCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const parentIndex = await ctx.db.category.findUnique({
        where: {
          id: input.parentId,
        },
        select: {
          categoryIndex: true,
        },
      });
      if (parentIndex) {
        if (parentIndex.categoryIndex + 1 > 4)
          throw new Error("You cannot add more than 5 categories");
        const updatedCategory = await ctx.db.category.update({
          where: {
            id: input.id,
          },
          data: {
            parentId: input.parentId,
            categoryIndex: parentIndex.categoryIndex + 1 || 0,
          },
        });
        return updatedCategory;
      } else {
        return null;
      }
    }),
  edit: withRole("superadmin", "admin")
    .input(editCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const updatedCategory = await ctx.db.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
      return updatedCategory;
    }),
  get: withRole("superadmin", "admin").query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      select: {
        id: true,
        name: true,
        parentId: true,
        categoryIndex: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return categories;
  }),
  delete: withRole("superadmin", "admin")
    .input(deleteCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const deletedCategory = await ctx.db.category.delete({
        where: {
          id: input.id,
        },
      });
      return deletedCategory;
    }),
});
