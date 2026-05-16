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

import { defineStepper } from "@stepperize/react";
import { StepStatus, useStepItemContext } from "@stepperize/react/primitives";

import { ButtonWithIcon } from "@/components/custom/button-with-icon";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { useState } from "react";

// form
import type { Category } from "@/app/generated/prisma";
import type { ObjectImageBlob, ObjectImageFile } from "@/components/custom/image-upload";
import type { FormDataAddProduct, ProductAddFormId } from "./add-product-step-form";
import { ProductInfoForm } from "./add-product-step-form/1-product-info";
import { GenerateProductVariantsForm } from "./add-product-step-form/2-generate-product-variant";
import VariantInfo from "./add-product-step-form/3-variant-info";
import { CompleteStep } from "./add-product-step-form/complete-setup";

const { Stepper } = defineStepper(
    {
        id: "productInfo",
        title: "Product Info",
        description: "Enter product details",
    },
    {
        id: "generateVariants",
        title: "Generate Variants",
        description: "Generate product variants",
    },
    {
        id: "variantInfo",
        title: "Variant Info",
        description: "Enter variant details",
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
            className="self-center bg-muted data-[status=success]:bg-primary data-disabled:opacity-50 transition-all duration-300 ease-in-out data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:min-w-4 data-[orientation=horizontal]:flex-1"
        />
    );
};

export default function AddProduct() {
    const trpc = useTRPC();
    const [combinated, setCombinated] = useState<{ name: string; values: string[] }[]>([]);
    const { data: categoriesData } = useQuery(trpc.category.get.queryOptions()) || [];
    const [file, setFile] = useState<ObjectImageFile[] | undefined>();
    const [blobPreview, setBlobPreview] = useState<ObjectImageBlob[] | null>(null);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <ButtonWithIcon startIcon={<Plus />}>Add Product</ButtonWithIcon>
            </DialogTrigger>
            <DialogContent
                onInteractOutside={e => e.preventDefault()}
                className="maxw-[90svw] sm:max-w-[80svw]! w-full max-h-[90svh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Use the form below to add a new product to your inventory. Once you have filled out all the
                        information, click &quot;Next&quot; to review your entries before submitting.
                    </DialogDescription>
                </DialogHeader>
                <Stepper.Root className="w-full space-y-4" orientation="horizontal">
                    {({ stepper }) => {
                        const stored = (id: ProductAddFormId) =>
                            stepper.metadata.get(id) as FormDataAddProduct | undefined;
                        const formData: FormDataAddProduct = {
                            productInfo: stored("productInfo")?.productInfo,
                            generateVariants: stored("generateVariants")?.generateVariants,
                            variantsInfo: stored("variantInfo")?.variantsInfo,
                        };

                        return (
                            <>
                                <Stepper.List className="sm:flex sm:list-none sm:gap-2 sm:flex-row sm:items-center sm:justify-between overflow-auto ">
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

                                <div className="bg-card p-6 rounded-md">
                                    {stepper.flow.switch({
                                        productInfo: () => (
                                            <ProductInfoForm
                                                file={file}
                                                setFile={setFile}
                                                blobPreview={blobPreview}
                                                setBlobPreview={setBlobPreview}
                                                categoriesData={categoriesData as Category[]}
                                                defaultValues={formData.productInfo}
                                                onNext={data => {
                                                    stepper.metadata.set("productInfo", {
                                                        ...formData,
                                                        productInfo: data,
                                                    });
                                                    stepper.navigation.next();
                                                }}
                                            />
                                        ),
                                        generateVariants: () => (
                                            <GenerateProductVariantsForm
                                                combinated={combinated}
                                                setCombinated={setCombinated}
                                                onNext={data => {
                                                    stepper.metadata.set("generateVariants", {
                                                        ...formData,
                                                        generateVariants: data,
                                                    });
                                                    stepper.navigation.next();
                                                }}
                                                defaultValues={formData.generateVariants}
                                                onPrev={() => {
                                                    stepper.navigation.prev();
                                                }}
                                            />
                                        ),
                                        variantInfo: () => (
                                            <VariantInfo
                                                file={file}
                                                blobPreview={blobPreview}
                                                setFile={setFile}
                                                setBlobPreview={setBlobPreview}
                                                setCombinated={setCombinated}
                                                combinated={combinated}
                                                formData={formData}
                                                onNext={data => {
                                                    stepper.metadata.set("variantInfo", {
                                                        ...formData,
                                                        variantsInfo: data,
                                                    });
                                                    stepper.navigation.next();
                                                }}
                                                defaultValues={formData.variantsInfo}
                                                onPrev={() => {
                                                    stepper.navigation.prev();
                                                }}
                                            />
                                        ),
                                        complete: () => (
                                            <CompleteStep
                                                blobPreview={blobPreview}
                                                file={file}
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
