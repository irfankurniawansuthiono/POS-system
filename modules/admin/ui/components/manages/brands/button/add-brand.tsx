"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Ribbon } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { AddBrandFormValues, addBrandSchema } from "@/lib/form-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { appToast } from "@/components/custom/app-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleImageUpload } from "@/components/custom/image-upload";
import { useUploadImage } from "@/hooks/use-upload-image";
import { useDeleteImage } from "@/hooks/use-remove-image";
export default function AddBrand() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [blobPreview, setBlobPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const form = useForm<AddBrandFormValues>({
    resolver: zodResolver(addBrandSchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      logoUrl: "",
    },
  });
  const {deleteImage} = useDeleteImage({
    onSuccess: () => {
    },
    onError: (err) => {
      appToast.error(err.message);
    },
  });
  const trpc = useTRPC();
  
  const createBrandMutation = useMutation(
    trpc.brand.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.brand.get.queryFilter());
        form.reset();
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Brand created successfully!");
      },
      onError: (err, data) => {
        setError(err.message);
        if(data.logoUrl){
          deleteImage(data.logoUrl);
          form.setValue("logoUrl", "");
          setBlobPreview(null);
          setFile(undefined);
        }
        appToast.error(err.message || "Something went wrong!");
      },
    }),
  );


  const { uploadImage, isUploading } = useUploadImage({
    pathName: "brands",

    onSuccess: (url) => {
      console.log("changed", url);
      form.setValue("logoUrl", url);
    },
    onError: (err) => {
      appToast.error(err.message);
    },
  });

  const onSubmit = async (data: AddBrandFormValues) => {
    console.log("data before", data);
    setError(undefined);
    if (file) {
      const url = await uploadImage(file);
      data.logoUrl = url;
      setFile(undefined);
      setBlobPreview(null);
    }
    console.log("data after", data);
    createBrandMutation.mutate(data);
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon startIcon={<Ribbon />} variant="default">
          Add New Brand
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand to the store
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter brand's name"
                      {...field}
                      disabled={createBrandMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <SingleImageUpload
                  blobPreview={blobPreview}
                  setBlobPreview={setBlobPreview}
                  setFile={setFile}
                  label="Brand's Logo"
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange("")}
                  disabled={createBrandMutation.isPending}
                />
              )}
            />
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
                  createBrandMutation.isPending ? <Spinner /> : <Ribbon />
                }
                className={`${
                  createBrandMutation.isPending || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={createBrandMutation.isPending}
              >
                {createBrandMutation.isPending ? "Adding..." : "Add Brand"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
