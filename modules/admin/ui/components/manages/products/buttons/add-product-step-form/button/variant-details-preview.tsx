import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { VariantInfo } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

export default function VariantDetailPreview({ data }: { data: VariantInfo }) {
    const [isOpen, setIsOpen] = useState(false);
    const trpc = useTRPC();
    const { data: supplier1 } = useQuery(
        trpc.supplier.getById.queryOptions(
            { id: data.supplierId },
            {
                enabled: !!data.supplierId,
            },
        ),
    );

    const { data: supplier2 } = useQuery(
        trpc.supplier.getById.queryOptions(
            { id: data.supplierId2 as string },
            {
                enabled: !!data.supplierId2,
            },
        ),
    );

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">View Details</Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{data.displayName}</SheetTitle>
                    <SheetDescription>Variant detail information</SheetDescription>
                </SheetHeader>

                <div className="px-2">
                    <Table className="w-full border-collapse text-sm">
                        <TableBody>
                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground w-35">Key</TableCell>
                                <TableCell className="py-3 break-all">{data.key}</TableCell>
                            </TableRow>

                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">
                                    Supplier 1
                                </TableCell>
                                <TableCell className="py-3">{supplier1?.name ?? "-"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">
                                    Supplier 2
                                </TableCell>
                                <TableCell className="py-3">{supplier2?.name ?? "-"}</TableCell>
                            </TableRow>
                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">Stock</TableCell>
                                <TableCell className="py-3">{data.stock}</TableCell>
                            </TableRow>

                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">Barcode</TableCell>
                                <TableCell className="py-3 break-all">{data.barcode}</TableCell>
                            </TableRow>

                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">SKU</TableCell>
                                <TableCell className="py-3">{data.sku}</TableCell>
                            </TableRow>

                            <TableRow className="border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">
                                    Cost Price
                                </TableCell>
                                <TableCell className="py-3">Rp {data.costPrice.toLocaleString("id-ID")}</TableCell>
                            </TableRow>

                            <TableRow className="align-top border-b">
                                <TableCell className="py-3 pr-4 font-medium text-muted-foreground">
                                    Attributes
                                </TableCell>

                                <TableCell className="py-3">
                                    <div className="space-y-2">
                                        {data.attributes.length > 0 ? (
                                            data.attributes.map((attr, index) => (
                                                <div key={index} className="rounded-md border p-2">
                                                    <div className="font-medium">{attr.name}</div>
                                                    <div className="text-muted-foreground">{attr.value}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-muted-foreground">No attributes</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>

                            <TableRow className="align-top border-b">
                                <TableCell colSpan={2} className="space-y-3 py-4">
                                    <div className="font-medium text-muted-foreground">Pricing Rules</div>

                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Min Qty</TableHead>
                                                    <TableHead>Max Qty</TableHead>
                                                    <TableHead>Price</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {data.pricingRules.length > 0 ? (
                                                    data.pricingRules.map((rule, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{rule.minQty}</TableCell>

                                                            <TableCell>{rule.maxQty ?? "∞"} </TableCell>

                                                            <TableCell>
                                                                Rp {rule.price.toLocaleString("id-ID")}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="text-center text-muted-foreground"
                                                        >
                                                            No pricing rules
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {data.imageUrl && (
                                <TableRow>
                                    <TableCell className="py-3 pr-4 font-medium text-muted-foreground align-top">
                                        Image
                                    </TableCell>

                                    <TableCell className="py-3">
                                        <Image
                                            width={32}
                                            height={32}
                                            src={data.imageUrl}
                                            alt={data.displayName}
                                            className="rounded-md border object-cover"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <SheetFooter className="mt-6">
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
