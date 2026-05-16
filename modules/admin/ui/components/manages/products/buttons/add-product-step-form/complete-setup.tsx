import type { Category } from "@/app/generated/prisma";
import type { ObjectImageBlob, ObjectImageFile } from "@/components/custom/image-upload";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GenerateVariantAttribute, ProductInfo, VariantsInfo } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import VariantDetailPreview from "./button/variant-details-preview";

export function CompleteStep({
    formData,
    categoriesData,
    onReset,
    onPrev,
    file,
    blobPreview,
}: {
    formData: {
        productInfo?: ProductInfo;
        generateVariants?: GenerateVariantAttribute;
        variantsInfo?: VariantsInfo;
    };
    file: ObjectImageFile[] | undefined;
    blobPreview: ObjectImageBlob[] | null;
    onReset: () => void;
    categoriesData: Category[];
    onPrev: () => void;
}) {
    const trpc = useTRPC();
    const categoryText =
        formData.productInfo?.category
            .map((catId: string) => {
                const category = categoriesData?.find(c => c.id === catId);
                return category ? category.name : "Unknown";
            })
            .join(" > ") || "N/A";

    const { data: brand } = useQuery(trpc.brand.getById.queryOptions({ id: formData.productInfo?.brandId || "" }));

    return (
        <div className="space-y-4">
            <div className="rounded border bg-secondary w-full p-4 space-y-3 overflow-auto">
                <div>
                    <SeparatorWithText text="Product Summary" />
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Image</strong>
                                </TableCell>
                                <TableCell>
                                    {blobPreview && (
                                        <Image
                                            src={
                                                blobPreview.find(blob => blob.key === "product")?.url ??
                                                "https://placehold.co/400x400"
                                            }
                                            alt="product"
                                            width={400}
                                            height={400}
                                            className="object-contain"
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Name</strong>
                                </TableCell>
                                <TableCell>{formData.productInfo?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Description</strong>
                                </TableCell>
                                <TableCell>{formData.productInfo?.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Brand</strong>
                                </TableCell>
                                <TableCell>{brand?.name}</TableCell>
                                <TableCell className="w-full">
                                    {brand?.logoUrl && (
                                        <img src={brand.logoUrl} alt={brand.name} className="w-16 h-16 object-fit" />
                                    )}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Category</strong>
                                </TableCell>
                                <TableCell>{categoryText}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* product variants */}
                <SeparatorWithText text="Product Variants" />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formData.variantsInfo?.variants.map((variant, index) => (
                            <TableRow key={variant.sku}>
                                <TableCell>
                                    <strong>{index + 1}</strong>
                                </TableCell>
                                <TableCell>{variant.displayName.split("-")[1]}</TableCell>
                                <TableCell>
                                    {blobPreview && (
                                        <Image
                                            src={
                                                blobPreview.find(blob => blob.key === variant.displayName)?.url ??
                                                "https://placehold.co/100x100"
                                            }
                                            alt="product"
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <VariantDetailPreview data={variant} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={onPrev}>
                    Previous
                </Button>
                <Button type="button" onClick={onReset}>
                    Start Over
                </Button>
            </div>
        </div>
    );
}
