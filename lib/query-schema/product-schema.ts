import { z } from "zod";
export const productInfoSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    brandId: z.string().min(1, "Brand is required"),
    category: z.string().array().min(1, "Category is required"),
    isActive: z.boolean(),
    imageUrl: z.string().optional(),
});

export type ProductInfo = z.infer<typeof productInfoSchema>;

export const GenerateVariantAttributeSchema = z.object({
    attributes: z
        .array(
            z.object({
                name: z.string().min(1, "Attribute name is required"),
                values: z
                    .array(z.string().min(1))
                    .min(1, "At least one value is required")
                    .refine(values => new Set(values).size === values.length, {
                        message: "Duplicate values are not allowed",
                    }),
            }),
        )
        .min(1)
        .refine(
            attributes => {
                const names = attributes.map(a => a.name.toLowerCase().trim());
                return new Set(names).size === names.length;
            },
            {
                message: "Duplicate attribute names are not allowed",
                path: ["attributes"],
            },
        ),
});

export type GenerateVariantAttribute = z.infer<typeof GenerateVariantAttributeSchema>;

export const pricingRules = z
    .array(
        z.object({
            profitMargin: z.number().min(0, "Profit margin must be a positive number"),
            minQty: z.number().min(1, "Minimum quantity must be at least 1"),
            maxQty: z.number().optional(),
            price: z.number().min(0, "Price must be a positive number"),
        }),
    )
    .superRefine((rules, ctx) => {
        for (let i = 0; i < rules.length; i++) {
            const current = rules[i];

            if (current.maxQty !== undefined && current.maxQty <= current.minQty && i !== rules.length - 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Max quantity must be greater than min quantity",
                    path: [i, "maxQty"],
                });
            }

            for (let j = 0; j < rules.length; j++) {
                if (i === j) continue;

                const other = rules[j];
                const currentMax = current.maxQty ?? Infinity;
                const otherMax = other.maxQty ?? Infinity;

                const isOverlapping = current.minQty <= otherMax && currentMax >= other.minQty;

                if (isOverlapping) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Quantity range overlaps with rule ${j + 1}`,
                        path: [i, "minQty"],
                    });
                }
            }
        }
    });
export const VariantInfoSchema = z.object({
    key: z.string(),
    supplierId: z.string(),
    supplierId2: z.string().optional(),
    stock: z.number().min(0, "Stock must be a positive number"),
    displayName: z.string().min(1, "Display name is required"),
    barcode: z.string().min(1, "Barcode is required"),
    sku: z.string().min(1, "SKU is required"),
    costPrice: z.number().min(1, "Modal must be a positive number"),
    attributes: z.array(
        z.object({
            name: z.string().min(1, "Attribute name is required"),
            value: z.string().min(1, "Attribute value cannot be empty"),
        }),
    ),
    pricingRules: pricingRules,
    imageUrl: z.string().optional(),
});
export const VariantsInfoSchema = z.object({
    variants: z.array(VariantInfoSchema).superRefine((variants, ctx) => {
        const seenBarcodes = new Map<string, number>();
        const seenSkus = new Map<string, number>();

        variants.forEach((variant, index) => {
            // Check barcode duplicates
            if (seenBarcodes.has(variant.barcode)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Barcode "${variant.barcode}" already used`,
                    path: [index, "barcode"],
                });
            } else {
                seenBarcodes.set(variant.barcode, index);
            }

            // Check SKU duplicates
            if (seenSkus.has(variant.sku)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `SKU "${variant.sku}" already used`,
                    path: [index, "sku"],
                });
            } else {
                seenSkus.set(variant.sku, index);
            }
        });
    }),
});
export type VariantsInfo = z.infer<typeof VariantsInfoSchema>;
export type VariantInfo = z.infer<typeof VariantInfoSchema>;
