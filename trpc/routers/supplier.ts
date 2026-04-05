import { createTRPCRouter, withRole } from "@/trpc/init";
import { addSupplierSchema } from "@/lib/form-schema";
import { Prisma } from "@/app/generated/prisma";
import useGetUniquePrismaField from "@/hooks/get-unique-prisma-field";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const supplierRouter = createTRPCRouter({
  //   delete: withRole("superadmin", "admin")
  //     .input(deleteBrandSchema)
  //     .mutation(async ({ input, ctx }) => {
  //       const deletedBrand = await ctx.db.brand.delete({
  //         where: {
  //           id: input.id,
  //         },
  //       });
  //       return deletedBrand;
  //     }),
  //   edit: withRole("superadmin", "admin")
  //     .input(editBrandSchema)
  //     .mutation(async ({ input, ctx }) => {
  //       const editedBrand = await ctx.db.brand.update({
  //         where: {
  //           id: input.id,
  //         },
  //         data: {
  //           name: input.name,
  //           logoUrl: input.logoUrl,
  //         },
  //       });
  //       return editedBrand;
  //     }),
  create: withRole("superadmin", "admin")
    .input(addSupplierSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        if (input.email) {
          const existingSupplierEmail = await ctx.db.supplier.findFirst({
            where: {
              email: input.email,
            },
          });
          if (existingSupplierEmail) {
            throw new Error("Supplier Email already exists!");
          }
        }
        if (input.gmapsUrl) {
          // checking duplicate gmaps url
          const existingSupplierGmapsUrl = await ctx.db.supplier.findFirst({
            where: {
              email: input.gmapsUrl,
            },
          });
          if (existingSupplierGmapsUrl) {
            throw new Error("Supplier's Company GMaps Url already exists!");
          }
        }
        if (input.bankAccountNumber) {
          // bank account number
          const existingSupplierBankAccountNumber =
            await ctx.db.supplier.findFirst({
              where: {
                bankAccountNumber: input.bankAccountNumber,
              },
            });
          if (existingSupplierBankAccountNumber) {
            throw new Error("Supplier's Bank Account Number already exists!");
          }
        }

        const newSupplier = await ctx.db.supplier.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            address: input.address,
            gmapsUrl: input.gmapsUrl,
            city: input.city,
            companyName: input.companyName,
            contactPerson: input.contactPerson,
            notes: input.notes,
            paymentTerm: input.paymentTerm,
            tempoDays: input.tempoDays || null,
            bankName: input.bankName,
            bankAccountNumber: input.bankAccountNumber,
            accountHolderName: input.accountHolderName,
          },
        });
        return newSupplier;
      } catch (err: any) {
        if (err.code === "P2002") {
          const field = useGetUniquePrismaField({ text: err.message });

          const fieldMessages: Record<string, string> = {
            name: "Company Name already exists!",
            email: "Supplier Email already exists!",
            phone: "Supplier Phone already exists!",
            companyName: "PT/CV Name already exists!",
          };
          throw new Error(
            fieldMessages[field ?? ""] ?? "A unique field already exists!",
          );
        } else {
          throw new Error(err.message);
        }
      }
    }),
  //   setStatus: withRole("superadmin", "admin")
  //     .input(editStatusBrandSchema)
  //     .mutation(async ({ input, ctx }) => {
  //       const editedBrandStatus = await ctx.db.brand.update({
  //         where: {
  //           id: input.id,
  //         },
  //         data: {
  //           isActive: input.status,
  //         },
  //       });
  //       return editedBrandStatus;
  //     }),
  //   get: withRole("superadmin", "admin")
  //     .input(getBrandSchema)
  //     .query(async ({ ctx, input }) => {
  //       const currentPage = input.page || 1;
  //       const limit = input.limit || 10;
  //       const search = input.search || "";
  //       const hasLogo = input.hasLogo;
  //       const isBrandsActive = input.isBrandsActive;
  //       const sortDirection = input.sortDirection || "desc";
  //       const sortBy = input.sortBy || "updatedAt";
  //       const skip = (currentPage - 1) * limit;
  //       const brandTotal = await ctx.db.brand.count({
  //         where: {
  //           OR: [
  //             {
  //               name: {
  //                 contains: search,
  //                 mode: "insensitive",
  //               },
  //               isActive:
  //                 isBrandsActive === undefined
  //                   ? undefined
  //                   : { equals: isBrandsActive },
  //               logoUrl:
  //                 hasLogo === true
  //                   ? {
  //                       not: null,
  //                       notIn: [""],
  //                     }
  //                   : hasLogo === false
  //                     ? {
  //                         equals: "",
  //                       }
  //                     : undefined,
  //             },
  //           ],
  //         },
  //       });
  //       const brands = await ctx.db.brand.findMany({
  //         skip,
  //         take: limit,
  //         where: {
  //           OR: [
  //             {
  //               name: {
  //                 contains: search,
  //                 mode: "insensitive",
  //               },
  //               isActive:
  //                 isBrandsActive === undefined
  //                   ? undefined
  //                   : { equals: isBrandsActive },
  //               logoUrl:
  //                 hasLogo === true
  //                   ? {
  //                       not: null,
  //                       notIn: [""],
  //                     }
  //                   : hasLogo === false
  //                     ? {
  //                         equals: "",
  //                       }
  //                     : undefined,
  //             },
  //           ],
  //         },
  //         orderBy: {
  //           [sortBy]: sortDirection,
  //         },
  //       });
  //       const hasNextPage = skip + brands.length < brandTotal;
  //       const hasPreviousPage = skip > 0;
  //       const totalPages = Math.ceil(brandTotal / limit);
  //       const meta = {
  //         total: brandTotal,
  //         currentPage,
  //         limit,
  //         hasNextPage,
  //         hasPreviousPage,
  //         totalPages,
  //         nextPage: hasNextPage ? currentPage + 1 : null,
  //         previousPage: hasPreviousPage ? currentPage - 1 : null,
  //       };

  //       return { brands, meta };
  //     }),
});
