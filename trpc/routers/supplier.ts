import getUniquePrismaField from "@/hooks/get-unique-prisma-field";
import { addSupplierSchema } from "@/lib/form-schema";
import { deleteSupplierSchema, getListSupplierSchema, getSupplierSchema } from "@/lib/query-schema/supplier-schema";
import { createTRPCRouter, withRole } from "@/trpc/init";
import z from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const supplierRouter = createTRPCRouter({
    getList: withRole("superadmin", "admin")
        .input(getListSupplierSchema)
        .query(async ({ ctx, input }) => {
            const supplier = await ctx.db.supplier.findMany({
                where: {
                    NOT: {
                        id: input.excludeId,
                    },
                    ...(input.search && {
                        name: {
                            contains: input.search,
                            mode: "insensitive",
                        },
                    }),
                },
                select: {
                    id: true,
                    name: true,
                },
                orderBy: { name: "asc" },
                take: 20, // limit hasil
            });
            return supplier;
        }),
    get: withRole("superadmin")
        .input(getSupplierSchema)
        .query(async ({ ctx, input }) => {
            const currentPage = input.page || 1;
            const limit = input.limit || 10;
            const sortDirection = input.sortDirection || "desc";
            const sortBy = input.sortBy || "updatedAt";
            const search = input.search || "";
            const skip = (currentPage - 1) * limit;

            // filter state
            const hasBank = input.hasBank;
            const hasTempo = input.hasTempo;
            const paymentTerms = input.paymentTerms;
            const city = input.city;

            const supplierTotal = await ctx.db.supplier.count({
                where: {
                    NOT: {
                        id: ctx.session.user.id,
                    },
                    AND: [
                        {
                            city: city
                                ? {
                                      equals: city,
                                  }
                                : undefined,
                        },
                        {
                            paymentTerm: paymentTerms
                                ? {
                                      equals: paymentTerms,
                                  }
                                : undefined,
                        },
                        {
                            tempoDays: hasTempo === true ? { not: null } : hasTempo === false ? null : undefined,
                        },
                        {
                            bankName: hasBank === true ? { not: null } : hasBank === false ? null : undefined,
                        },
                    ],
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            companyName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            contactPerson: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            city: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            address: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            phone: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            });
            const suppliers = await ctx.db.supplier.findMany({
                skip,
                take: limit,
                where: {
                    NOT: {
                        id: ctx.session.user.id,
                    },
                    AND: [
                        {
                            city: input.city
                                ? {
                                      equals: input.city,
                                  }
                                : undefined,
                        },
                        {
                            paymentTerm: paymentTerms
                                ? {
                                      equals: paymentTerms,
                                  }
                                : undefined,
                        },
                        {
                            paymentTerm: paymentTerms
                                ? {
                                      equals: paymentTerms,
                                  }
                                : undefined,
                        },
                        {
                            tempoDays: hasTempo === true ? { not: null } : hasTempo === false ? null : undefined,
                        },
                    ],
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            companyName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            contactPerson: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            city: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            address: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            phone: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                orderBy: {
                    [sortBy]: sortDirection,
                },
            });
            const suppliersCity = await ctx.db.supplier.findMany({
                where: {
                    city: {
                        not: null,
                    },
                },
                select: {
                    city: true,
                },
                distinct: ["city"],
            });
            const hasNextPage = skip + suppliers.length < supplierTotal;
            const hasPreviousPage = skip > 0;
            const totalPages = Math.ceil(supplierTotal / limit);
            const meta = {
                total: supplierTotal,
                currentPage,
                limit,
                hasNextPage,
                hasPreviousPage,
                totalPages,
                nextPage: hasNextPage ? currentPage + 1 : null,
                previousPage: hasPreviousPage ? currentPage - 1 : null,
            };

            return { suppliers, meta, suppliersCity };
        }),
    getById: withRole("superadmin", "admin")
        .input(deleteSupplierSchema)
        .query(async ({ ctx, input }) => {
            const supplier = await ctx.db.supplier.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    name: true,
                },
            });
            if (!supplier) {
                throw new Error("Brand not found");
            }
            return supplier;
        }),
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
                    const existingSupplierBankAccountNumber = await ctx.db.supplier.findFirst({
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
                    const field = getUniquePrismaField({ text: err.message });

                    const fieldMessages: Record<string, string> = {
                        name: "Known As already exists!",
                        email: "Supplier Email already exists!",
                        phone: "Supplier Phone already exists!",
                        companyName: "PT/CV Name already exists!",
                    };
                    throw new Error(fieldMessages[field ?? ""] ?? "A unique field already exists!");
                } else {
                    throw new Error(err.message);
                }
            }
        }),
    edit: withRole("superadmin", "admin")
        .input(addSupplierSchema.extend({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const existingSupplier = await ctx.db.supplier.findUnique({
                    where: {
                        id: input.id,
                    },
                });
                if (!existingSupplier) {
                    throw new Error("Supplier not found!");
                }
                if (input.email && input.email !== existingSupplier.email) {
                    const existingSupplierEmail = await ctx.db.supplier.findFirst({
                        where: {
                            email: input.email,
                        },
                    });
                    if (existingSupplierEmail) {
                        throw new Error("Supplier Email already exists!");
                    }
                }
                if (input.gmapsUrl && input.gmapsUrl !== existingSupplier.gmapsUrl) {
                    const existingSupplierGmapsUrl = await ctx.db.supplier.findFirst({
                        where: {
                            gmapsUrl: input.gmapsUrl,
                        },
                    });
                    if (existingSupplierGmapsUrl) {
                        throw new Error("Supplier's Company GMaps Url already exists!");
                    }
                }
                if (input.bankAccountNumber && input.bankAccountNumber !== existingSupplier.bankAccountNumber) {
                    const existingSupplierBankAccountNumber = await ctx.db.supplier.findFirst({
                        where: {
                            bankAccountNumber: input.bankAccountNumber,
                        },
                    });
                    if (existingSupplierBankAccountNumber) {
                        throw new Error("Supplier's Bank Account Number already exists!");
                    }
                }

                const editedSupplier = await ctx.db.supplier.update({
                    where: {
                        id: input.id,
                    },
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
                return editedSupplier;
            } catch (err: any) {
                if (err.code === "P2002") {
                    const field = getUniquePrismaField({ text: err.message });

                    const fieldMessages: Record<string, string> = {
                        name: "Known As already exists!",
                        email: "Supplier Email already exists!",
                        phone: "Supplier Phone already exists!",
                        companyName: "PT/CV Name already exists!",
                    };
                    throw new Error(fieldMessages[field ?? ""] ?? "A unique field already exists!");
                } else {
                    throw new Error(err.message);
                }
            }
        }),
    delete: withRole("superadmin", "admin")
        .input(deleteSupplierSchema)
        .mutation(async ({ input, ctx }) => {
            const deletedSupplier = await ctx.db.supplier.delete({
                where: {
                    id: input.id,
                },
            });
            return deletedSupplier;
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
