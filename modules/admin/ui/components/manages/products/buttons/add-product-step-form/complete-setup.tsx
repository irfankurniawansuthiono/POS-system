import type { Category } from "@/app/generated/prisma";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductInfo } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";

import { useQuery } from "@tanstack/react-query";

export function CompleteStep({
    formData,
    categoriesData,
    onReset,
    onPrev,
}: {
    formData: {
        product?: ProductInfo;
    };
    onReset: () => void;
    categoriesData: Category[];
    onPrev: () => void;
}) {
    const trpc = useTRPC();
    const categoryText =
        formData.product?.category
            .map((catId: string) => {
                const category = categoriesData?.find(c => c.id === catId);
                return category ? category.name : "Unknown";
            })
            .join(" > ") || "N/A";

    const { data: brand } = useQuery(trpc.brand.getById.queryOptions({ id: formData.product?.brandId || "" }));
    return (
        <div className="space-y-4">
            <div className="rounded border bg-secondary p-4 space-y-3">
                <h3 className="font-semibold">Summary</h3>
                <div>
                    <SeparatorWithText text="Product Summary" />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead>Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <strong>Name</strong>
                                </TableCell>
                                <TableCell>{formData.product?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <strong>Description</strong>
                                </TableCell>
                                <TableCell>{formData.product?.description}</TableCell>
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
