import type { GenerateVariantAttribute, ProductInfo, VariantsInfo } from "@/lib/query-schema/product-schema";

export type FormDataAddProduct = {
    productInfo?: ProductInfo;
    generateVariants?: GenerateVariantAttribute;
    variantsInfo?: VariantsInfo;
};

export type ProductAddFormId = "productInfo" | "generateVariants" | "variantInfo";
