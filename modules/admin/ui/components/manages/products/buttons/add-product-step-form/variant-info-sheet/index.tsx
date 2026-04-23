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

import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { VariantInfoSchema } from "@/lib/query-schema/product-schema";
import { FormatNumber, parseNumber } from "@/utils/formatNumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot } from "lucide-react";
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
    const [open, setOpen] = useState(false);

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

    useEffect(() => {
        if (profitMarginWatch !== undefined && costPriceWatch !== undefined) {
            const basePrice = costPriceWatch + (costPriceWatch * profitMarginWatch) / 100;
            form.setValue("basePrice", basePrice);
        }
    }, [profitMarginWatch, costPriceWatch, form]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button onClick={e => e.stopPropagation()} variant="outline" size="sm">
                    Manage
                </Button>
            </SheetTrigger>
            <SheetContent onInteractOutside={e => e.preventDefault()}>
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

                <div className="space-y-3 p-4">
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
                                    <InputGroupInput placeholder="Profit Margin (%)" {...field} />
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
                                <Label htmlFor={`basePrice-${index}`} className="mb-1">
                                    Base Price (1pcs)
                                    <Bot className="inline-block" size={16} />
                                </Label>
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
                    {/* field lainnya... */}
                </div>
                <SheetFooter>
                    <Button onClick={handleSave}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
