import { z } from "zod";
const productInfoSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    brandId: z.string().min(1, "Brand is required"),
    category: z.string().array().min(1, "Category is required"),
    isActive: z.boolean(),
});

export type ProductInfo = z.infer<typeof productInfoSchema>;
export { productInfoSchema };

export const GenerateVariantAttributeSchema = z.object({
    attributes: z.array(
        z.object({
            name: z.string().min(1, "Attribute name is required"),
            values: z.array(z.string().min(1, "Attribute value cannot be empty")),
        }),
    ),
});

export type GenerateVariantAttribute = z.infer<typeof GenerateVariantAttributeSchema>;
