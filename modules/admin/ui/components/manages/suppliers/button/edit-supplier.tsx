"use client";
import { PaymentTerm } from "@/app/generated/prisma";
import { appToast } from "@/components/custom/app-toast";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { PhoneInput } from "@/components/custom/phone-input";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { AddSupplierFormValues } from "@/lib/form-schema";
import { editSupplierSchema } from "@/lib/query-schema/supplier-schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AtSign,
    Building,
    Building2,
    Contact,
    HandCoins,
    LocateFixed,
    Map,
    MapPinned,
    NotebookText,
    Pencil,
    Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";

export default function EditSupplier({ id, data }: { id: string; data: AddSupplierFormValues }) {
    const [error, setError] = useState<string | undefined>(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm<AddSupplierFormValues>({
        resolver: zodResolver(editSupplierSchema),
        mode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            name: data.name || "",
            companyName: data.companyName || "",
            contactPerson: data.contactPerson || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            gmapsUrl: data.gmapsUrl || "",
            city: data.city || "",
            notes: data.notes || "",
            paymentTerm: data.paymentTerm,
            tempoDays: data.tempoDays || 30,
            accountHolderName: data.accountHolderName || "",
            bankAccountNumber: data.bankAccountNumber || "",
            bankName: data.bankName || "",
        },
    });

    useEffect(() => {
        if (dialogOpen) {
            form.reset({
                name: data.name || "",
                companyName: data.companyName || "",
                contactPerson: data.contactPerson || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                gmapsUrl: data.gmapsUrl || "",
                city: data.city || "",
                notes: data.notes || "",
                paymentTerm: data.paymentTerm,
                tempoDays: data.tempoDays || 30,
                accountHolderName: data.accountHolderName || "",
                bankAccountNumber: data.bankAccountNumber || "",
                bankName: data.bankName || "",
            });
        }
    }, [data, form, dialogOpen]);

    const storage = typeof window !== "undefined" ? localStorage : undefined;

    useFormPersist("add-supplier-form", {
        watch: form.watch,
        setValue: form.setValue,
        storage: storage,
    });

    const trpc = useTRPC();

    const paymentTermWatch = useWatch({
        control: form.control,
        name: "paymentTerm",
    });

    // if payment term changed to cash, reset tempo related fields
    useEffect(() => {
        if (paymentTermWatch === PaymentTerm.CASH) {
            form.setValue("tempoDays", 0);
            form.setValue("accountHolderName", "");
            form.setValue("bankAccountNumber", "");
            form.setValue("bankName", "");
        }
    }, [paymentTermWatch, form]);

    const editSupplierMutation = useMutation(
        trpc.supplier.edit.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.supplier.get.queryFilter());
                form.reset();
                setDialogOpen(false);
                setError(undefined);
                appToast.success("Supplier created successfully!");
            },
            onError: err => {
                setError(err.message);
                appToast.error(err.message);
            },
        }),
    );
    const onSubmit = async (data: AddSupplierFormValues) => {
        setError(undefined);
        editSupplierMutation.mutate({ ...data, id });
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm md:max-w-md xl:max-w-xl w-full">
                <div className="h-[80vh] no-scrollbar overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Edit Supplier</DialogTitle>
                                <DialogDescription>Edit Supplier {data.name}</DialogDescription>
                            </DialogHeader>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {/* supplier data */}
                            <SeparatorWithText text="Contact Person Information" />
                            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* contact person */}
                                <FormField
                                    control={form.control}
                                    name="contactPerson"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Contact size={16} />
                                                Contact Person Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <AtSign size={16} />
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* phone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Phone size={16} />
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                    placeholder="081234567890"
                                                    defaultCountry="ID"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <SeparatorWithText text="Company Information" />
                            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* Company Name field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Building size={16} />
                                                Known As
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Surya Indonesia" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* company name PT/CV */}
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Building2 size={16} />
                                                Company Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="PT/CV Surya Indonesia" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* address */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <LocateFixed size={16} />
                                                Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jl. Surya No. 1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* gmaps link */}
                                <FormField
                                    control={form.control}
                                    name="gmapsUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <MapPinned size={16} />
                                                Gmaps Link
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://maps.google.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* city */}
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <Map size={16} />
                                                City
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jakarta" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* notes */}
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <NotebookText size={16} />
                                            Notes
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} placeholder="some special notes here" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SeparatorWithText text="Payment Information" />
                            {/* payment term */}
                            <FormField
                                control={form.control}
                                name="paymentTerm"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            <HandCoins size={16} />
                                            Payment Term
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                defaultValue={PaymentTerm.CASH}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        className="w-full"
                                                        placeholder={"Select Payment Term"}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={PaymentTerm.CASH}>Cash</SelectItem>
                                                    <SelectItem value={PaymentTerm.TEMPO}>Tempo/Credit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* only available if payment type is tempo */}
                            {paymentTermWatch === PaymentTerm.TEMPO && (
                                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {/* account holder name */}
                                    <FormField
                                        control={form.control}
                                        name="accountHolderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Holder Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Alexa Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* bank account number */}
                                    <FormField
                                        control={form.control}
                                        name="bankAccountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Account Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1231123123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* bank name */}
                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="BCA" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* tempo days */}
                                    <FormField
                                        control={form.control}
                                        name="tempoDays"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default Payment Tempo Days</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value ?? ""}
                                                        onChange={e =>
                                                            field.onChange(
                                                                e.target.value === ""
                                                                    ? undefined
                                                                    : Number.isNaN(e.target.value)
                                                                      ? 30
                                                                      : Number(e.target.value),
                                                            )
                                                        }
                                                        placeholder="30"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="select-none cursor-pointer">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <ButtonWithIcon
                                    type="submit"
                                    startIcon={editSupplierMutation.isPending ? <Spinner /> : <Pencil />}
                                    className={`${
                                        editSupplierMutation.isPending || !form.formState.isValid
                                            ? "cursor-not-allowed pointer-events-none"
                                            : ""
                                    }`}
                                    disabled={editSupplierMutation.isPending || !form.formState.isValid}
                                >
                                    {editSupplierMutation.isPending ? "Updating..." : "Update Supplier"}
                                </ButtonWithIcon>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
