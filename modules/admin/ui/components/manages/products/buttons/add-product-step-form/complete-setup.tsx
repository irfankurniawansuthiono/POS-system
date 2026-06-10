import type { Category } from "@/app/generated/prisma";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GenerateVariantAttribute, ProductInfo, VariantsInfo } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";

import { appToast } from "@/components/custom/app-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import VariantDetailPreview from "./button/variant-details-preview";

export function CompleteStep({
    formData,
    categoriesData,
    onReset,
    onPrev,
}: {
    formData: {
        productInfo?: ProductInfo;
        generateVariants?: GenerateVariantAttribute;
        variantsInfo?: VariantsInfo;
    };
    onReset: () => void;
    categoriesData: Category[];
    onPrev: () => void;
}) {
    const trpc = useTRPC();
    const createProductMutation = useMutation(
        trpc.product.create.mutationOptions({
            onSuccess: () => {
                onReset();
                appToast.success("Product created successfully!");
            },
            onError: err => {
                appToast.error("Error creating product : " + err.message);
                console.error(err);
            },
        }),
    );
    const categoryText =
        formData.productInfo?.category
            .map((catId: string) => {
                const category = categoriesData?.find(c => c.id === catId);
                return category ? category.name : "Unknown";
            })
            .join(" > ") || "N/A";

    const { data: brand } = useQuery(trpc.brand.getById.queryOptions({ id: formData.productInfo?.brandId || "" }));
    const onSubmit = () => {
        createProductMutation.mutate({
            productInfo: formData.productInfo!,
            generateVariants: formData.generateVariants!,
            variantsInfo: formData.variantsInfo!,
        });
    };
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
                                    <img
                                        src={formData.productInfo?.imageUrl || "https://placehold.co/400?text=No+Image"}
                                        alt="product"
                                        width={400}
                                        height={400}
                                        className="object-contain"
                                    />
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
                                <TableCell>
                                    <div
                                        className="prose max-h-75 overflow-y-auto"
                                        dangerouslySetInnerHTML={{
                                            __html: formData.productInfo?.description || <></>,
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Brand</strong>
                                </TableCell>
                                <TableCell>{brand?.name}</TableCell>
                                <TableCell className="w-full">
                                    <img
                                        src={brand?.logoUrl || "https://placehold.co/400?text=No+Image"}
                                        alt="brand logo"
                                        width={70}
                                        height={70}
                                        className="object-contain"
                                    />
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
                            <TableHead>Name</TableHead>
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
                                <TableCell>{variant.displayName}</TableCell>
                                <TableCell>{variant.displayName.split("-")[1]}</TableCell>
                                <TableCell>
                                    <img
                                        src={variant.imageUrl || "https://placehold.co/400?text=No+Image"}
                                        alt="product"
                                        width={70}
                                        height={70}
                                        className="object-contain"
                                    />
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
                <Button type="submit" onClick={onSubmit}>
                    Finish
                </Button>
            </div>
        </div>
    );
}
