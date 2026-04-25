import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { VariantInfo, VariantsInfo } from "@/lib/query-schema/product-schema";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { FormDataAddProduct } from ".";
import VariantDeleteGenerated from "./button/variant-delete-generated";
import VariantInfoSheet from "./button/variant-info-sheet";

type CombinationRow = { [key: string]: string | string[] };

export default function VariantInfo({
    onNext,
    defaultValues,
    onPrev,
    combinated,
    setCombinated,
    formData,
}: {
    onNext: (data: VariantsInfo) => void;
    defaultValues?: VariantsInfo;
    formData: FormDataAddProduct;
    onPrev: () => void;
    combinated: { name: string; values: string[] }[];
    setCombinated: React.Dispatch<React.SetStateAction<{ name: string; values: string[] }[]>>;
}) {
    const form = useForm<VariantsInfo>({
        defaultValues: { variants: defaultValues?.variants || [] },
    });

    const handleVariantSave = useCallback(
        (index: number, data: VariantInfo) => {
            form.setValue(`variants.${index}`, data);
        },
        [form],
    );

    const columns = useMemo<ColumnDef<CombinationRow>[]>(() => {
        if (!combinated || combinated.length === 0) return [];

        const dynamicCols = Object.keys(combinated[0]).map(key => ({
            id: key,
            accessorKey: key,
            header: key,
            cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
                const value = row.getValue(key);
                return Array.isArray(value) ? value.join(", ") : String(value ?? "");
            },
        }));

        const actionCol: ColumnDef<CombinationRow> = {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const rowValues = Object.keys(combinated[0]).reduce(
                    (acc, key) => {
                        acc[key] = row.getValue(key);
                        return acc;
                    },
                    {} as Record<string, unknown>,
                );

                return (
                    <div className="flex items-center gap-2">
                        <VariantInfoSheet
                            productName={formData.productInfo?.name || ""}
                            index={row.index}
                            rowValues={rowValues}
                            onSave={handleVariantSave}
                        />
                        <VariantDeleteGenerated
                            rowValues={rowValues}
                            onConfirm={() => {
                                const newCombinated = [...combinated];
                                newCombinated.splice(row.index, 1);
                                setCombinated(newCombinated);
                            }}
                        />
                    </div>
                );
            },
        };

        return [...dynamicCols, actionCol];
    }, [combinated, handleVariantSave, formData, setCombinated]);

    const table = useReactTable({
        data: combinated as CombinationRow[],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-4">
            <Heading
                title={formData.productInfo?.name || "N/A"}
                description="Each step will be marked as complete once all required variant details are filled in."
            />
            <Table>
                <TableHeader className="table w-full table-fixed">
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="block max-h-75 overflow-y-auto w-full">
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} className="table w-full table-fixed">
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={columns.length} className="text-right">
                            Total Variants: {table.getRowCount()}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="flex justify-end gap-2">
                <Button type="button" onClick={onPrev}>
                    Previous
                </Button>
                <Button type="button" onClick={() => {}}>
                    Next
                </Button>
            </div>
        </div>
    );
}
