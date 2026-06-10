import getUniquePrismaField from "@/hooks/get-unique-prisma-field";
import { addProductSchema } from "@/lib/query-schema/product-schema";
import { createTRPCRouter, withRole } from "@/trpc/init";
import { calculatePrice } from "@/utils/calculateVariantPrice";

export const productRouter = createTRPCRouter({
    create: withRole("admin", "superadmin")
        .input(addProductSchema)
        .mutation(async ({ input, ctx }) => {
            if (input.variantsInfo.variants.length < 1) {
                throw new Error("You must have at least 1 variant");
            }

            // Ambil config langsung dari DB, bukan React hook
            const config = await ctx.db.appConfig.findFirst();
            if (!config) throw new Error("App config not found");

            return await ctx.db.$transaction(async tx => {
                try {
                    // 1. Create product
                    const product = await tx.product.create({
                        data: {
                            name: input.productInfo.name,
                            description: input.productInfo.description,
                            brandId: input.productInfo.brandId,
                            categoryId: input.productInfo.category.at(-1)!,
                            isActive: input.productInfo.isActive,
                        },
                    });

                    // 2. Create semua variants sekaligus
                    await tx.variant.createMany({
                        data: input.variantsInfo.variants.map(variant => ({
                            productId: product.id,
                            displayName: variant.displayName,
                            sku: variant.sku,
                            barcode: variant.barcode ?? null,
                            stock: variant.stock,
                            costPrice: variant.costPrice,
                            attributes: Object.fromEntries(variant.attributes.map(attr => [attr.name, attr.value])),
                        })),
                    });

                    // 3. Fetch variants yang baru dibuat untuk dapat ID-nya
                    const createdVariants = await tx.variant.findMany({
                        where: { productId: product.id },
                        select: { id: true, sku: true },
                    });

                    // Map sku -> id untuk lookup
                    const skuToId = Object.fromEntries(createdVariants.map(v => [v.sku, v.id]));

                    // 4. Create pricing rules untuk semua variants
                    const pricingRulesData = input.variantsInfo.variants.flatMap(variant =>
                        variant.pricingRules.map(rule => ({
                            variantId: skuToId[variant.sku]!,
                            minQty: rule.minQty,
                            maxQty: rule.maxQty ?? null,
                            profitMargin: rule.profitMargin,
                            price: calculatePrice({
                                costPrice: variant.costPrice,
                                profitMargin: rule.profitMargin,
                                ppn: Number(config.ppn),
                                isPpnEnabled: config.isPpnEnabled,
                            }),
                        })),
                    );

                    await tx.pricingRule.createMany({ data: pricingRulesData });

                    // 5. Create VariantSupplier jika ada
                    const supplierData = input.variantsInfo.variants.flatMap(variant => {
                        const variantId = skuToId[variant.sku]!;
                        const entries = [];
                        if (variant.supplierId) {
                            entries.push({ variantId, supplierId: variant.supplierId });
                        }
                        if (variant.supplierId2) {
                            entries.push({ variantId, supplierId: variant.supplierId2 });
                        }
                        return entries;
                    });

                    if (supplierData.length > 0) {
                        await tx.variantSupplier.createMany({ data: supplierData });
                    }

                    // 6. Return product lengkap
                    return tx.product.findUniqueOrThrow({
                        where: { id: product.id },
                        include: {
                            variants: {
                                include: { pricingRules: true, variantSuppliers: true },
                            },
                        },
                    });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    if (error?.code === "P2002") {
                        const field = getUniquePrismaField({ text: error.message });

                        const fieldMessages: Record<string, string> = {
                            sku: "Product Variant With the same SKU already exists!",
                            barcode: "Product Variant With the same Barcode already exists!",
                        };
                        throw new Error(fieldMessages[field ?? ""] ?? "A unique field already exists!");
                    } else {
                        throw error;
                    }
                }
            });
        }),
});
