"use client";

import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GenerateVariantAttributeSchema, type GenerateVariantAttribute } from "@/lib/query-schema/product-schema";
import { cn } from "@/lib/utils";
import generateCombinations from "@/utils/generateVariantsCombination";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export function GenerateProductVariantsForm({
    onNext,
    defaultValues,
    onPrev,
    combinated,
    setCombinated,
}: {
    onNext: (data: GenerateVariantAttribute) => void;
    defaultValues?: GenerateVariantAttribute;
    onPrev: () => void;
    combinated: { name: string; values: string[] }[];
    setCombinated: React.Dispatch<React.SetStateAction<{ name: string; values: string[] }[]>>;
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const form = useForm<GenerateVariantAttribute>({
        resolver: zodResolver(GenerateVariantAttributeSchema),
        defaultValues: defaultValues || {
            attributes: [{ name: "", values: [""] }],
        },
    });

    const {
        fields: attributeFields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "attributes",
    });

    const handleAddAttribute = () => {
        append({ name: "", values: [""] });
    };

    const handleRemoveAttribute = (index: number) => {
        setIsDeleting(true);
        setTimeout(() => {
            remove(index);
            setIsDeleting(false);
        }, 300);
    };

    const handleSubmit = () => {
        form.handleSubmit(data => {
            const generatedData = generateCombinations(data.attributes);
            setCombinated(generatedData);
            setOpenConfirmation(true);
        })();
    };

    // Error duplikat nama attribute ada di root level array
    const attributeRootError = form.formState.errors.attributes?.root?.message;

    return (
        <div className="space-y-4">
            <div className="flex justify-start">
                <ButtonWithIcon startIcon={<Plus />} type="button" onClick={handleAddAttribute}>
                    Add Variant
                </ButtonWithIcon>
            </div>

            {/* Error duplikat nama attribute */}
            {attributeRootError && <p className="text-sm text-destructive">{attributeRootError}</p>}

            <div className="max-h-75 overflow-y-auto space-y-2">
                {attributeFields.map((attr, index) => {
                    const nameError = form.formState.errors.attributes?.[index]?.name?.message;
                    const valuesError =
                        form.formState.errors.attributes?.[index]?.values?.message ??
                        (form.formState.errors.attributes?.[index]?.values as { message?: string } | undefined)
                            ?.message;

                    return (
                        <div
                            key={attr.id}
                            className={cn(
                                "border rounded-md p-3 flex flex-col gap-3 transition-colors",
                                (nameError || valuesError) && "border-destructive bg-destructive/5",
                            )}
                        >
                            <Label>Attribute {index + 1}</Label>
                            <div className="flex gap-2">
                                {/* Nama attribute */}
                                <div className="flex-1 space-y-1">
                                    <Controller
                                        name={`attributes.${index}.name`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                placeholder="e.g. Color, Size, Material"
                                                {...field}
                                                aria-label={`Attribute ${index + 1} Name`}
                                                className={cn(
                                                    nameError && "border-destructive focus-visible:ring-destructive",
                                                )}
                                            />
                                        )}
                                    />
                                    {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                                </div>

                                {/* Values attribute */}
                                <div className="flex-1 space-y-1">
                                    <Controller
                                        name={`attributes.${index}.values`}
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="e.g. Red, Green, Blue (comma separated)"
                                                aria-label={`Attribute ${index + 1} Values`}
                                                onChange={e => {
                                                    const values = e.target.value.split(",").map(v => v.trim());
                                                    field.onChange(values);
                                                }}
                                                value={
                                                    Array.isArray(field.value) ? field.value.join(", ") : field.value
                                                }
                                                className={cn(
                                                    valuesError && "border-destructive focus-visible:ring-destructive",
                                                )}
                                            />
                                        )}
                                    />
                                    {valuesError && <p className="text-xs text-destructive">{valuesError}</p>}
                                </div>

                                {/* Hapus attribute */}
                                <Button
                                    size="icon"
                                    disabled={isDeleting || attributeFields.length === 1}
                                    type="button"
                                    onClick={() => index !== 0 && handleRemoveAttribute(index)}
                                    variant="destructive"
                                    className="shrink-0"
                                >
                                    <Trash className={cn("h-4 w-4", isDeleting && "animate-pulse")} />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={openConfirmation} onOpenChange={setOpenConfirmation}>
                <DialogContent
                    className="max-w-[80svw] max-h-[90svh] overflow-y-auto"
                    onInteractOutside={e => e.preventDefault()}
                >
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="inline-block" size={30} /> Generated Variants Combination
                    </DialogTitle>
                    <DialogDescription>
                        Below are the generated combinations based on the attributes you provided. You can choose to
                        continue with these variants or go back to modify the attributes.
                    </DialogDescription>
                    <Table>
                        <TableHeader className="table w-full table-fixed">
                            <TableRow>
                                {combinated && combinated.length > 0
                                    ? Object.keys(combinated[0]).map((key, index) => (
                                          <TableHead key={index}>{key}</TableHead>
                                      ))
                                    : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="block max-w-[80svw] max-h-[50svh] overflow-y-auto">
                            {combinated?.map((combination, index) => (
                                <TableRow key={index} className="table w-full table-fixed">
                                    {Object.values(combination).map((value, i) => (
                                        <TableCell key={i}>{value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={attributeFields.length} className="text-right">
                                    Total Variants: {combinated?.length || 0}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <p className="mt-4 text-sm text-muted-foreground">
                        These variants generated automatically. You can delete the ones you don&apos;t need afterward.
                    </p>
                    <DialogFooter>
                        <Button onClick={() => onNext({ attributes: form.getValues().attributes || [] })}>
                            Continue with this variants
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={onPrev}>
                    Previous
                </Button>
                <Button type="button" onClick={handleSubmit}>
                    Generate Combination
                </Button>
            </div>
        </div>
    );
}
