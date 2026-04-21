import type { GenerateVariantAttribute, ProductInfo } from "@/lib/query-schema/product-schema";

export type FormDataAddProduct = {
    product?: ProductInfo;
    generateVariants?: GenerateVariantAttribute;
};

export type ProductAddFormId = "product" | "generateVariants";
