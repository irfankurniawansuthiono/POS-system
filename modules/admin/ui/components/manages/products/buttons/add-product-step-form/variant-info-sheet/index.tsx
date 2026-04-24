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
import type { VariantInfo } from "@/lib/query-schema/product-schema";
import { Controller, useWatch } from "react-hook-form";

import { AsyncSelect } from "@/components/custom/async-select";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppConfig } from "@/hooks/use-app-config";
import { VariantInfoSchema } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";
import { FormatNumber, parseNumber } from "@/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, CircleQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function VariantInfoSheet({
    index,
    rowValues,
    defaultValues,
    onSave,
    productName,
}: {
    productName: string;
    index: number;
    rowValues: Record<string, unknown>;
    defaultValues?: VariantInfo;
    onSave: (index: number, data: VariantInfo) => void;
}) {
    const { data: config } = useAppConfig();
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const form = useForm<VariantInfo>({
        resolver: zodResolver(VariantInfoSchema),
        defaultValues: defaultValues ?? {
            key: String(index),
            supplierId: "",
            stock: 0,
            displayName: "",
            barcode: "",
            sku: "",
            basePrice: 0,
            costPrice: 0,
            attributes: Object.entries(rowValues).map(([name, value]) => ({
                name,
                value: String(value),
            })),
        },
    });

    const handleSave = form.handleSubmit(data => {
        onSave(index, data);
        setOpen(false);
    });

    const profitMarginWatch = useWatch({
        control: form.control,
        name: "profitMargin",
    });
    const costPriceWatch = useWatch({
        control: form.control,
        name: "costPrice",
    });
    const supplierIdValue = useWatch({
        control: form.control,
        name: "supplierId",
    });

    const supplierId2Value = useWatch({
        control: form.control,
        name: "supplierId2",
    });

    useEffect(() => {
        if (profitMarginWatch !== undefined && costPriceWatch !== undefined) {
            const basePrice = costPriceWatch + (costPriceWatch * profitMarginWatch) / 100;
            const basePriceWithPPN =
                config?.isPpnEnabled && Number(config.ppn) > 0 ? basePrice * Number(config.ppn) : basePrice;
            form.setValue("basePrice", basePriceWithPPN);
        }
    }, [profitMarginWatch, costPriceWatch, form, config?.isPpnEnabled, config?.ppn]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button onClick={e => e.stopPropagation()} variant="outline" size="sm">
                    Manage
                </Button>
            </SheetTrigger>
            <SheetContent className="max-w-md overflow-y-auto" onInteractOutside={e => e.preventDefault()}>
                <SheetHeader>
                    <SheetTitle>Variant Details</SheetTitle>
                    <SheetDescription>
                        {Object.entries(rowValues).map(([key, value], i) => (
                            <strong key={i}>
                                {key}: {String(value)}
                                <br />
                            </strong>
                        ))}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 p-4">
                    <Controller
                        control={form.control}
                        name="sku"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`sku-${index}`} className="mb-1">
                                    SKU
                                </Label>
                                <Input {...field} placeholder="SKU" />
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="barcode"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`barcode-${index}`} className="mb-1">
                                    Barcode
                                </Label>
                                <Input {...field} placeholder="Barcode" />
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="displayName"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`displayName-${index}`} className="mb-1">
                                    Display Name
                                    <Bot className="inline-block" size={16} />
                                </Label>
                                <Input
                                    {...field}
                                    disabled
                                    value={`${productName} - ${Object.values(rowValues).join(", ")}`}
                                    placeholder="Display Name"
                                />
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="costPrice"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`costPrice-${index}`} className="mb-1">
                                    Modal
                                </Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder="Modal"
                                        {...field}
                                        value={field.value && FormatNumber(field.value)}
                                        onChange={e => field.onChange(parseNumber(e.target.value))}
                                    />
                                    <InputGroupAddon>
                                        <span>Rp</span>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="profitMargin"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`profitMargin-${index}`} className="mb-1">
                                    Profit Margin (%)
                                </Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder="Profit Margin (%)"
                                        {...field}
                                        value={field.value && FormatNumber(field.value)}
                                        onChange={e => field.onChange(parseNumber(e.target.value))}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>%</span>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="stock"
                        render={({ field, fieldState }) => (
                            <div>
                                <Label htmlFor={`stock-${index}`} className="mb-1">
                                    Stock
                                </Label>
                                <InputGroup>
                                    <InputGroupInput
                                        placeholder="Stock"
                                        {...field}
                                        value={field.value && FormatNumber(field.value)}
                                        onChange={e => field.onChange(parseNumber(e.target.value))}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <span>Pcs</span>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="basePrice"
                        render={({ field, fieldState }) => (
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={`basePrice-${index}`} className="mb-1">
                                        Base Price (1pcs)
                                        <Bot className="inline-block" size={16} />
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <CircleQuestionMark size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {config?.isPpnEnabled && Number(config?.ppn) > 0 ? (
                                                <p>
                                                    Base Price is calculated from Cost Price + Profit Margin, then
                                                    multiplied by PPN ({Number(config.ppn) * 100}%).
                                                </p>
                                            ) : (
                                                <p>Base Price is calculated from Cost Price + Profit Margin.</p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <InputGroup>
                                    <InputGroupInput
                                        disabled
                                        placeholder="Base Price (1pcs)"
                                        {...field}
                                        value={
                                            field.value &&
                                            // get profit margin from form and calculate base price
                                            FormatNumber(
                                                field.value +
                                                    (field.value * (form.getValues("profitMargin") || 0)) / 100,
                                            )
                                        }
                                        onChange={e => field.onChange(parseNumber(e.target.value))}
                                    />
                                    <InputGroupAddon>
                                        <span>Rp</span>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.error && <p className="text-sm text-red-500">{fieldState.error.message}</p>}
                            </div>
                        )}
                    />
                    <div className="flex items-center justify-between">
                        <Controller
                            name={"supplierId"}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="stepper-form-variant-supplier">Supplier </FieldLabel>
                                    <AsyncSelect
                                        key={supplierId2Value}
                                        fetcher={async query => {
                                            return await queryClient.fetchQuery(
                                                trpc.supplier.getList.queryOptions({
                                                    search: query ?? "",
                                                    excludeId: supplierId2Value,
                                                }),
                                            );
                                        }}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select a supplier..."
                                        renderOption={option => (
                                            <div className="flex items-center gap-2">
                                                <p>{option.name}</p>
                                            </div>
                                        )}
                                        getOptionValue={option => option.id}
                                        getDisplayValue={option => (
                                            <div className="flex items-center gap-2">
                                                <p>{option.name}</p>
                                            </div>
                                        )}
                                        label="Supplier"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={"supplierId2"}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="stepper-form-variant-supplier-2">Supplier 2</FieldLabel>
                                    <AsyncSelect
                                        disabled={!supplierIdValue}
                                        key={supplierIdValue}
                                        fetcher={async query => {
                                            return await queryClient.fetchQuery(
                                                trpc.supplier.getList.queryOptions({
                                                    search: query ?? "",
                                                    excludeId: supplierId2Value,
                                                }),
                                            );
                                        }}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Select a supplier..."
                                        renderOption={option => (
                                            <div className="flex items-center gap-2">
                                                <p>{option.name}</p>
                                            </div>
                                        )}
                                        getOptionValue={option => option.id}
                                        getDisplayValue={option => (
                                            <div className="flex items-center gap-2">
                                                <p>{option.name}</p>
                                            </div>
                                        )}
                                        label="Supplier 2"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                    <SeparatorWithText text="Variant Pricing Rule" />
                    {/* field lainnya... */}
                </div>
                <SheetFooter>
                    <Button onClick={handleSave}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
