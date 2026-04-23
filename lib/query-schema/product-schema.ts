import { z } from "zod";
export const productInfoSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    brandId: z.string().min(1, "Brand is required"),
    category: z.string().array().min(1, "Category is required"),
    isActive: z.boolean(),
});

export type ProductInfo = z.infer<typeof productInfoSchema>;

export const GenerateVariantAttributeSchema = z.object({
    attributes: z.array(
        z.object({
            name: z.string().min(1, "Attribute name is required"),
            values: z.array(z.string().min(1, "Attribute value cannot be empty")),
        }),
    ),
});

export type GenerateVariantAttribute = z.infer<typeof GenerateVariantAttributeSchema>;

export const VariantInfoSchema = z.object({
    key: z.string(),
    supplierId: z.string(),
    supplierId2: z.string().optional(),
    stock: z.number().min(0, "Stock must be a positive number"),
    displayName: z.string().min(1, "Display name is required"),
    barcode: z.string().min(1, "Barcode is required"),
    sku: z.string().min(1, "SKU is required"),
    basePrice: z.number().min(0, "Base price (1pcs) must be a positive number"),
    profitMargin: z.number().min(0, "Profit margin must be a positive number"),
    costPrice: z.number().min(0, "Modal must be a positive number"),
    attributes: z.array(
        z.object({
            name: z.string().min(1, "Attribute name is required"),
            value: z.string().min(1, "Attribute value cannot be empty"),
        }),
    ),
});
export const VariantsInfoSchema = z.object({
    variants: z.array(VariantInfoSchema),
});
export type VariantsInfo = z.infer<typeof VariantsInfoSchema>;
export type VariantInfo = z.infer<typeof VariantInfoSchema>;
