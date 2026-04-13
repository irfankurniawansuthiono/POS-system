"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import {
  UserPlus,
  Contact,
  AtSign,
  Phone,
  Building2,
  Building,
  LocateFixed,
  MapPinned,
  Map,
  NotebookText,
  HandCoins,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { AddSupplierFormValues, addSupplierSchema } from "@/lib/form-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { appToast } from "@/components/custom/app-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentTerm } from "@/app/generated/prisma";
import { PhoneInput } from "@/components/custom/phone-input";
import SeparatorWithText from "@/components/custom/separator-with-text-1";
import { Textarea } from "@/components/ui/textarea";
import useFormPersist from "react-hook-form-persist";
export default function AddSupplier() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<AddSupplierFormValues>({
    resolver: zodResolver(addSupplierSchema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gmapsUrl: "",
      city: "",
      notes: "",
      paymentTerm: PaymentTerm.CASH,
      tempoDays: 30,
      accountHolderName: "",
      bankAccountNumber: "",
      bankName: "",
    },
  });
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

  const createSupplierMutation = useMutation(
    trpc.supplier.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.supplier.get.queryFilter());
        form.reset();
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Supplier created successfully!");
      },
      onError: (err) => {
        setError(err.message);
        appToast.error(err.message);
      },
    }),
  );
  const onSubmit = async (data: AddSupplierFormValues) => {
    setError(undefined);
    createSupplierMutation.mutate(data);
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon startIcon={<UserPlus />} variant="default">
          Add New Supplier
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-md xl:max-w-xl w-full">
        <div className="h-[80vh] no-scrollbar overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>
                  Please fill in the form to create a new supplier.
                </DialogDescription>
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
                        <Input
                          type="email"
                          placeholder="email@gmail.com"
                          {...field}
                        />
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
                        <Input
                          placeholder="https://maps.google.com"
                          {...field}
                        />
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
                      <Textarea
                        rows={4}
                        placeholder="some special notes here"
                        {...field}
                      />
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
                          <SelectItem value={PaymentTerm.TEMPO}>
                            Tempo/Credit
                          </SelectItem>
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
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number.isNaN(e.target.value) ? 30 : Number(e.target.value),
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
                  <Button
                    variant="outline"
                    className="select-none cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <ButtonWithIcon
                  type="submit"
                  startIcon={
                    createSupplierMutation.isPending ? (
                      <Spinner />
                    ) : (
                      <UserPlus />
                    )
                  }
                  className={`${
                    createSupplierMutation.isPending || !form.formState.isValid
                      ? "cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                  disabled={
                    createSupplierMutation.isPending || !form.formState.isValid
                  }
                >
                  {createSupplierMutation.isPending
                    ? "Adding..."
                    : "Add Supplier"}
                </ButtonWithIcon>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
