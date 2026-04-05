import { createTRPCRouter, withRole } from "@/trpc/init";
import { addBrandSchema, editBrandSchema } from "@/lib/form-schema";
import {
  deleteBrandSchema,
  editStatusBrandSchema,
  getBrandSchema,
} from "@/lib/query-schema/brand-schema-api";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const brandRouter = createTRPCRouter({
  delete: withRole("superadmin", "admin")
    .input(deleteBrandSchema)
    .mutation(async ({ input, ctx }) => {
      const deletedBrand = await ctx.db.brand.delete({
        where: {
          id: input.id,
        },
      });
      return deletedBrand;
    }),
  edit: withRole("superadmin", "admin")
    .input(editBrandSchema)
    .mutation(async ({ input, ctx }) => {
      const editedBrand = await ctx.db.brand.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          logoUrl: input.logoUrl,
        },
      });
      return editedBrand;
    }),
  create: withRole("superadmin", "admin")
    .input(addBrandSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const newBrand = await ctx.db.brand.create({
          data: {
            name: input.name,
            logoUrl: input.logoUrl,
          },
        });
        return newBrand;
      } catch (err: any) {
        // invalid contraint name
        if (err.code === "P2002") {
          throw new Error("Brand name already exists!");
        }
      }
    }),
  setStatus: withRole("superadmin", "admin")
    .input(editStatusBrandSchema)
    .mutation(async ({ input, ctx }) => {
      const editedBrandStatus = await ctx.db.brand.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: input.status,
        },
      });
      return editedBrandStatus;
    }),
  get: withRole("superadmin", "admin")
    .input(getBrandSchema)
    .query(async ({ ctx, input }) => {
      const currentPage = input.page || 1;
      const limit = input.limit || 10;
      const search = input.search || "";
      const hasLogo = input.hasLogo;
      console.log("hasLogo", hasLogo);
      const isBrandsActive = input.isBrandsActive;
      const sortDirection = input.sortDirection || "desc";
      const sortBy = input.sortBy || "updatedAt";
      const skip = (currentPage - 1) * limit;
      const brandTotal = await ctx.db.brand.count({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
              isActive:
                isBrandsActive === undefined
                  ? undefined
                  : { equals: isBrandsActive },
              logoUrl:
                hasLogo === true
                  ? {
                      not: null,
                      notIn: [""],
                    }
                  : hasLogo === false
                    ? {
                        equals: "",
                      }
                    : undefined,
            },
          ],
        },
      });
      const brands = await ctx.db.brand.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
              isActive:
                isBrandsActive === undefined
                  ? undefined
                  : { equals: isBrandsActive },
              logoUrl:
                hasLogo === true
                  ? {
                      not: null,
                      notIn: [""],
                    }
                  : hasLogo === false
                    ? {
                        equals: "",
                      }
                    : undefined,
            },
          ],
        },
        orderBy: {
          [sortBy]: sortDirection,
        },
      });
      const hasNextPage = skip + brands.length < brandTotal;
      const hasPreviousPage = skip > 0;
      const totalPages = Math.ceil(brandTotal / limit);
      const meta = {
        total: brandTotal,
        currentPage,
        limit,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        nextPage: hasNextPage ? currentPage + 1 : null,
        previousPage: hasPreviousPage ? currentPage - 1 : null,
      };

      return { brands, meta };
    }),
});
