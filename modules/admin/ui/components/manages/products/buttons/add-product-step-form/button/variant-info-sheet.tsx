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

import { ObjectImageUpload, type ObjectImageBlob, type ObjectImageFile } from "@/components/custom/image-upload";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
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
    externalErrors,
    productName,
    file,
    blobPreview,
    setFile,
    setBlobPreview,
}: {
    productName: string;
    file: ObjectImageFile | undefined;
    blobPreview: ObjectImageBlob | null;
    setFile: React.Dispatch<React.SetStateAction<ObjectImageFile | undefined>>;
    setBlobPreview: React.Dispatch<React.SetStateAction<ObjectImageBlob | null>>;
    externalErrors?: {
        barcode?: string;
        sku?: string;
    };
    index: number;
    rowValues: Record<string, unknown>;
    defaultValues?: VariantInfo;
    onSave: (index: number, data: VariantInfo) => Promise<boolean>;
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
            imageUrl: "",
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
    const handleSave = form.handleSubmit(async data => {
        const success = await onSave(index, data);
        if (success) {
            setOpen(false); // ← hanya tutup jika berhasil
        }
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
        form.setValue("displayName", `${productName} - ${Object.values(rowValues).join(", ")}`);
    }, [productName, rowValues, form]);

    useEffect(() => {
        pricingRulesWatch?.forEach((rule, ruleIndex) => {
            const profitMargin = rule.profitMargin ?? 0;
            const basePrice = costPriceWatch + (costPriceWatch * profitMargin) / 100;
            const priceWithPPN =
                config?.isPpnEnabled && Number(config.ppn) > 0 ? basePrice * Number(config.ppn) + basePrice : basePrice;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        pricingRulesWatch?.map(r => r.profitMargin).join(","),
    ]);

    useEffect(() => {
        pricingRulesWatch?.forEach((rule, ruleIndex) => {
            if (ruleIndex < pricingRulesFields.length - 1) {
                const nextMinQty = pricingRulesWatch[ruleIndex + 1]?.minQty ?? 1;
                const expectedMaxQty = Math.max(0, nextMinQty - 1);

                // hanya setValue jika nilainya memang berbeda
                if (rule.maxQty !== expectedMaxQty) {
                    form.setValue(`pricingRules.${ruleIndex}.maxQty`, expectedMaxQty);
                }
            }
        });
    }, [form, pricingRulesFields, pricingRulesWatch]);

    return (
        <Sheet
            open={open}
            onOpenChange={val => {
                console.log("onOpenChange", val);
                setOpen(val);
            }}
        >
            <SheetTrigger asChild>
                <ButtonWithIcon startIcon={<Settings />} variant="outline" size="sm">
                    Manage
                </ButtonWithIcon>
            </SheetTrigger>
            <SheetContent
                className="max-w-3xl overflow-y-auto"
                onInteractOutside={e => {
                    console.log("onInteractOutside", e.type, e.target);
                    e.preventDefault();
                }}
                onFocusOutside={e => {
                    console.log("onFocusOutside", e.type, e.target);
                    e.preventDefault();
                }}
                onPointerDownOutside={e => {
                    console.log("onPointerDownOutside", e.type, e.target);
                    e.preventDefault();
                }}
                onEscapeKeyDown={e => {
                    console.log("onEscapeKeyDown");
                    e.preventDefault();
                }}
            >
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
                                    {(fieldState.error || externalErrors?.sku) && (
                                        <p className="text-sm text-red-500">
                                            {fieldState.error?.message || externalErrors?.sku}
                                        </p>
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
                                    {(fieldState.error || externalErrors?.barcode) && (
                                        <p className="text-sm text-red-500">
                                            {fieldState.error?.message || externalErrors?.barcode}
                                        </p>
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
                                <Input {...field} disabled placeholder="Display Name" />
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
                                            value={field.value && formatNumber(field.value)}
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
                                            value={field.value && formatNumber(field.value)}
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
                    {/* product variant image */}
                    <Controller
                        name={"imageUrl"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="stepper-form-product-variant-image">
                                    Product Variant Image [1:1 ratio]
                                </FieldLabel>
                                <ObjectImageUpload
                                    className="h-75 w-75"
                                    imageKey={`${productName} - ${Object.values(rowValues).join(", ")}`}
                                    value={field.value}
                                    file={
                                        file?.key === `${productName} - ${Object.values(rowValues).join(", ")}`
                                            ? file
                                            : undefined
                                    }
                                    blobPreview={
                                        blobPreview?.key === `${productName} - ${Object.values(rowValues).join(", ")}`
                                            ? blobPreview
                                            : null
                                    }
                                    setFile={setFile}
                                    setBlobPreview={setBlobPreview}
                                    onRemove={() => form.setValue("imageUrl", "")}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
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
                                            <Input
                                                disabled={index === 0}
                                                type="number"
                                                {...field}
                                                value={field.value && formatNumber(field.value)}
                                                onChange={e => field.onChange(parseNumber(e.target.value))}
                                            />
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
                                                placeholder={index === pricingRulesFields.length - 1 ? "∞" : undefined}
                                                value={
                                                    index < pricingRulesFields.length - 1
                                                        ? formatNumber(pricingRulesWatch?.[index]?.maxQty ?? 0)
                                                        : ""
                                                }
                                                onChange={e => field.onChange(parseNumber(e.target.value))}
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
                                                    value={field.value && formatNumber(field.value)}
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
                                                            ? formatNumber(
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
