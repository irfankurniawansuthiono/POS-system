"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { StepStatus, useStepItemContext } from "@stepperize/react/primitives";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { AsyncSelect } from "@/components/custom/async-select";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Cascader } from "@/components/ui/cascader";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { buildProductCategoriesTree } from "@/utils/categories-tree";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";

const productInfoSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    brandId: z.string().min(1, "Brand is required"),
    category: z.string().array().min(1, "Category is required"),
    isActive: z.boolean(),
});
type Category = {
    id: string;
    parentId: string;
    name: string;
    updatedAt: Date;
    createdAt: Date;
    categoryIndex: number;
};

type ProductInfo = z.infer<typeof productInfoSchema>;

const { Stepper } = defineStepper(
    {
        id: "product",
        title: "Product Info",
        description: "Enter product details",
    },
    {
        id: "complete",
        title: "Complete",
        description: "Review and submit",
    },
);

const StepperTriggerWrapper = () => {
    const item = useStepItemContext();
    const isInactive = item.status === "inactive";

    return (
        <Stepper.Trigger
            render={domProps => (
                <Button
                    className="rounded-full"
                    variant={isInactive ? "secondary" : "default"}
                    size="icon"
                    {...domProps}
                >
                    <Stepper.Indicator>{item.index + 1}</Stepper.Indicator>
                </Button>
            )}
        />
    );
};

const StepperTitleWrapper = ({ title }: { title: string }) => {
    return (
        <Stepper.Title
            render={domProps => (
                <h4 className="text-base font-medium" {...domProps}>
                    {title}
                </h4>
            )}
        />
    );
};

const StepperDescriptionWrapper = ({ description }: { description?: string }) => {
    if (!description) return null;
    return (
        <Stepper.Description
            render={domProps => (
                <p className="text-sm text-muted-foreground" {...domProps}>
                    {description}
                </p>
            )}
        />
    );
};

const StepperSeparatorWithStatus = ({ status, isLast }: { status: StepStatus; isLast: boolean }) => {
    if (isLast) return null;

    return (
        <Stepper.Separator
            orientation="horizontal"
            data-status={status}
            className="self-center bg-muted data-[status=success]:bg-primary data-[disabled]:opacity-50 transition-all duration-300 ease-in-out data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:min-w-4 data-[orientation=horizontal]:flex-1"
        />
    );
};

function ProductInfoForm({
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
                            <Textarea
                                {...field}
                                id="stepper-form-product-description"
                                aria-invalid={fieldState.invalid}
                                placeholder="This product is awesome because..."
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name={"brandId"}
                    control={form.control}
                    render={({ field, fieldState }) => (
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
                                            <img
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
                                            <img
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
            </FieldGroup>
            <div className="flex justify-end">
                <Button type="submit">Next</Button>
            </div>
        </form>
    );
}

function CompleteStep({
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
            .map(catId => {
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

type FormData = {
    product?: ProductInfo;
};

export default function AddProduct() {
    const trpc = useTRPC();
    const { data: categoriesData } = useQuery(trpc.category.get.queryOptions()) || [];
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ButtonWithIcon startIcon={<Plus />}>Add Product</ButtonWithIcon>
            </DialogTrigger>
            <DialogContent className="sm:max-w-fit">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Use the form below to add a new product to your inventory. Once you have filled out the
                        information, click &quot;Next&quot; to review your entries before submitting.
                    </DialogDescription>
                </DialogHeader>
                <Stepper.Root className="w-full space-y-4" orientation="horizontal">
                    {({ stepper }) => {
                        const stored = (id: "product") => stepper.metadata.get(id) as FormData | undefined;
                        const formData: FormData = {
                            product: stored("product")?.product,
                        };

                        return (
                            <>
                                <Stepper.List className="flex list-none gap-2 flex-row items-center justify-between">
                                    {stepper.state.all.map((stepData, index) => {
                                        const currentIndex = stepper.state.current.index;
                                        const status =
                                            index < currentIndex
                                                ? "success"
                                                : index === currentIndex
                                                  ? "active"
                                                  : "inactive";
                                        const isLast = index === stepper.state.all.length - 1;
                                        const data = stepData as {
                                            id: string;
                                            title: string;
                                            description?: string;
                                        };

                                        return (
                                            <React.Fragment key={stepData.id}>
                                                <Stepper.Item
                                                    step={stepData.id}
                                                    className="group peer relative flex shrink-0 items-center gap-2"
                                                >
                                                    <StepperTriggerWrapper />
                                                    <div className="flex flex-col items-start gap-1">
                                                        <StepperTitleWrapper title={data.title} />
                                                        <StepperDescriptionWrapper description={data.description} />
                                                    </div>
                                                </Stepper.Item>
                                                <StepperSeparatorWithStatus
                                                    key={`separator-${stepData.id}`}
                                                    status={status}
                                                    isLast={isLast}
                                                />
                                            </React.Fragment>
                                        );
                                    })}
                                </Stepper.List>

                                <div className="min-h-[280px] rounded border bg-card p-6">
                                    {stepper.flow.switch({
                                        product: () => (
                                            <ProductInfoForm
                                                categoriesData={categoriesData as Category[]}
                                                defaultValues={formData.product}
                                                onNext={data => {
                                                    stepper.metadata.set("product", {
                                                        ...formData,
                                                        product: data,
                                                    });
                                                    stepper.navigation.next();
                                                }}
                                            />
                                        ),
                                        complete: () => (
                                            <CompleteStep
                                                categoriesData={categoriesData as Category[]}
                                                formData={formData}
                                                onReset={() => {
                                                    stepper.metadata.reset();
                                                    stepper.navigation.reset();
                                                }}
                                                onPrev={() => stepper.navigation.prev()}
                                            />
                                        ),
                                    })}
                                </div>
                            </>
                        );
                    }}
                </Stepper.Root>
            </DialogContent>
        </Dialog>
    );
}
