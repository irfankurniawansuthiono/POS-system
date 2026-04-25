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
import { Controller, useFieldArray, useWatch } from "react-hook-form";

import { AsyncSelect } from "@/components/custom/async-select";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useAppConfig } from "@/hooks/use-app-config";
import { VariantInfoSchema } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";
import { FormatNumber, parseNumber } from "@/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, Plus, Settings, Trash } from "lucide-react";
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
            costPrice: 0,
            attributes: Object.entries(rowValues).map(([name, value]) => ({
                name,
                value: String(value),
            })),
            pricingRules: [
                {
                    minQty: 1,
                    maxQty: undefined,
                    price: 0,
                    profitMargin: 0,
                },
            ],
        },
    });
    function calculateVariantPrice(costPrice: number, profitMargin: number) {
        const basePrice = costPrice + (costPrice * profitMargin) / 100;
        return config?.isPpnEnabled && Number(config.ppn) > 0 ? basePrice * Number(config.ppn) + basePrice : basePrice;
    }
    const handleSave = form.handleSubmit(data => {
        onSave(index, data);
        setOpen(false);
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

    const pricingRulesWatch = useWatch({
        control: form.control,
        name: "pricingRules",
    });

    const {
        fields: pricingRulesFields,
        append: appendPricingRules,
        remove: removePricingRules,
    } = useFieldArray({
        control: form.control,
        name: "pricingRules",
    });

    useEffect(() => {
        pricingRulesWatch?.forEach((rule, ruleIndex) => {
            const profitMargin = rule.profitMargin ?? 0;
            const basePrice = costPriceWatch + (costPriceWatch * profitMargin) / 100;
            const priceWithPPN =
                config?.isPpnEnabled && Number(config.ppn) > 0 ? basePrice * Number(config.ppn) + basePrice : basePrice;

            // cek apakah nilai berubah sebelum setValue
            const currentPrice = form.getValues(`pricingRules.${ruleIndex}.price`);
            if (currentPrice !== priceWithPPN) {
                form.setValue(`pricingRules.${ruleIndex}.price`, priceWithPPN, {
                    shouldDirty: false,
                    shouldTouch: false,
                });
            }
        });
    }, [
        costPriceWatch,
        config?.isPpnEnabled,
        config?.ppn,
        form,
        pricingRulesWatch,
        // ambil hanya profitMargin dari setiap rule, bukan seluruh object
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pricingRulesWatch?.map(r => r.profitMargin).join(","),
    ]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <ButtonWithIcon startIcon={<Settings />} variant="outline" size="sm" onClick={e => e.stopPropagation()}>
                    Manage
                </ButtonWithIcon>
            </SheetTrigger>
            <SheetContent className="max-w-3xl overflow-y-auto" onInteractOutside={e => e.preventDefault()}>
                <SheetHeader>
                    <SheetTitle>{productName}</SheetTitle>
                    <SheetDescription>
                        {Object.entries(rowValues).map(([key, value], i) => (
                            <strong key={i}>
                                {key}: {String(value)}
                                <br />
                            </strong>
                        ))}
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 p-4 pt-0">
                    <SeparatorWithText text="Variant Information" />
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            control={form.control}
                            name="sku"
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label htmlFor={`sku-${index}`} className="mb-1">
                                        SKU
                                    </Label>
                                    <Input {...field} placeholder="SKU" />
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
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
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
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
                    <div className="grid grid-cols-2 gap-4">
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
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="stock"
                            render={({ field, fieldState }) => (
                                <div>
                                    <Label htmlFor={`stock-${index}`} className="mb-1">
                                        Current Stock
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
                                    {fieldState.error && (
                                        <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name={"supplierId"}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="stepper-form-variant-supplier">Supplier</FieldLabel>
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
                                                    excludeId: supplierIdValue,
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
                    <div>
                        <ButtonWithIcon
                            size="sm"
                            startIcon={<Plus />}
                            type="button"
                            onClick={() => {
                                appendPricingRules({
                                    minQty: 0,
                                    maxQty: 0,
                                    price: 0,
                                    profitMargin: 0,
                                });
                            }}
                        >
                            Add Pricing Rule
                        </ButtonWithIcon>
                    </div>
                    <div className="space-y-2 ">
                        {pricingRulesFields.map((field, index) => (
                            <div key={index} className="flex items-end gap-2">
                                <Controller
                                    name={`pricingRules.${index}.minQty`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="shrink-0 w-20" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`stepper-form-variant-pricing-rule-min-qty-${index}`}>
                                                Min Qty
                                            </FieldLabel>
                                            <Input disabled={index === 0} type="number" {...field} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name={`pricingRules.${index}.maxQty`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="shrink-0 w-20" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`stepper-form-variant-pricing-rule-max-qty-${index}`}>
                                                Max Qty
                                            </FieldLabel>
                                            <Input
                                                disabled
                                                type="number"
                                                {...field}
                                                value={
                                                    index < pricingRulesFields.length - 1
                                                        ? Math.max(0, (pricingRulesFields[index + 1]?.minQty ?? 0) - 1)
                                                        : 0
                                                }
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name={`pricingRules.${index}.profitMargin`}
                                    render={({ field, fieldState }) => (
                                        <div className="w-full">
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
                                            {fieldState.error && (
                                                <p className="text-sm text-red-500">{fieldState.error.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                                <Controller
                                    name={`pricingRules.${index}.price`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`stepper-form-variant-pricing-rule-price-${index}`}>
                                                Price
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    className="flex-1"
                                                    disabled
                                                    placeholder="Price"
                                                    {...field}
                                                    value={
                                                        pricingRulesWatch?.[index]?.profitMargin &&
                                                        costPriceWatch &&
                                                        config!.ppn! &&
                                                        config!.isPpnEnabled
                                                            ? FormatNumber(
                                                                  calculateVariantPrice(
                                                                      costPriceWatch,
                                                                      pricingRulesWatch[index].profitMargin,
                                                                  ),
                                                              )
                                                            : 0
                                                    }
                                                    onChange={e => field.onChange(parseNumber(e.target.value))}
                                                />
                                                <InputGroupAddon>
                                                    <span>Rp</span>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        removePricingRules(index);
                                    }}
                                    variant="destructive"
                                >
                                    <Trash />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {/* field lainnya... */}
                </div>
                <SheetFooter>
                    <div className="flex justify-end">
                        <Button type="button" size="lg" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
