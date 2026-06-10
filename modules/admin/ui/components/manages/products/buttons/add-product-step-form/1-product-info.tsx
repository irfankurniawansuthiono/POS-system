"use client";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { Category } from "@/app/generated/prisma";
import { AsyncSelect } from "@/components/custom/async-select";
import { SingleImageUpload } from "@/components/custom/image-upload";
import { RichTextEditor } from "@/components/custom/rich-text-editor";
import { Cascader } from "@/components/ui/cascader";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { productInfoSchema, type ProductInfo } from "@/lib/query-schema/product-schema";
import { useTRPC } from "@/trpc/client";
import { buildProductCategoriesTree } from "@/utils/categories-tree";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import AddBrand from "../../../brands/button/add-brand";

export function ProductInfoForm({
    onNext,
    defaultValues,
    categoriesData,
}: {
    onNext: (data: ProductInfo) => void;
    defaultValues?: ProductInfo;
    categoriesData?: Category[];
}) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const form = useForm<ProductInfo>({
        resolver: zodResolver(productInfoSchema),
        defaultValues: defaultValues || {
            name: "",
            description: "",
            brandId: "",
            category: [],
            isActive: true,
            imageUrl: "",
        },
    });
    return (
        <form id="stepper-form-product" onSubmit={form.handleSubmit(onNext)} className="space-y-4">
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="stepper-form-product-name">Product Name</FieldLabel>
                            <Input
                                {...field}
                                id="stepper-form-product-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Awesome Product"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="stepper-form-product-description">Description</FieldLabel>
                            <RichTextEditor
                                placeholder="Description of product here..."
                                label="Please add product descrption"
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <Controller
                        name={"brandId"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="flex items-end gap-2">
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="stepper-form-product-brand">Brand</FieldLabel>
                                    <AsyncSelect
                                        fetcher={async query => {
                                            return await queryClient.fetchQuery(
                                                trpc.brand.getList.queryOptions({ search: query ?? "" }),
                                            );
                                        }}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select a brand..."
                                        renderOption={option => (
                                            <div className="flex items-center gap-2">
                                                {option.logoUrl && (
                                                    <Image
                                                        width={30}
                                                        height={30}
                                                        src={option.logoUrl}
                                                        alt={option.name}
                                                        className="w-6 h-6 object-cover"
                                                    />
                                                )}
                                                <span>{option.name}</span>
                                            </div>
                                        )}
                                        getOptionValue={option => option.id}
                                        getDisplayValue={option => (
                                            <div className="flex items-center gap-2">
                                                {option.logoUrl && (
                                                    <Image
                                                        width={30}
                                                        height={30}
                                                        src={option.logoUrl}
                                                        alt={option.name}
                                                        className="w-6 h-6 rounded-full object-cover"
                                                    />
                                                )}
                                                <span>{option.name}</span>
                                            </div>
                                        )}
                                        label="Brand"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                                <AddBrand page="product" />
                            </div>
                        )}
                    />

                    <Controller
                        name={"category"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="stepper-form-product-category">Category</FieldLabel>
                                <Cascader
                                    onChange={field.onChange}
                                    value={field.value}
                                    placeholder="Select a category..."
                                    options={buildProductCategoriesTree(categoriesData || []) || []}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
                {/* image  */}
                <div>
                    <Controller
                        name={"imageUrl"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="stepper-form-product-image">Product Image [1:1 ratio]</FieldLabel>
                                <SingleImageUpload
                                    onChange={field.onChange}
                                    pathName="products/covers"
                                    className="h-75! w-75! aspect-square"
                                    value={field.value}
                                    onRemove={() => form.setValue("imageUrl", "")}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
            </FieldGroup>
            <div className="flex justify-end">
                <Button type="submit">Next</Button>
            </div>
        </form>
    );
}
