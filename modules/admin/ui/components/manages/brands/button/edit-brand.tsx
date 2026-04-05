"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Pencil } from "lucide-react";
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

import { EditBrandFormValues, editBrandSchema } from "@/lib/form-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { appToast } from "@/components/custom/app-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SingleImageUpload } from "@/components/custom/image-upload";
import { useUploadImage } from "@/hooks/use-upload-image";
import { useDeleteImage } from "@/hooks/use-remove-image";
export default function EditBrand({
  name,
  logoUrl,
  id,
}: {
  name: string;
  logoUrl: string | null;
  id: string;
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const realLogoUrl = logoUrl ? logoUrl : "";
  const [blobPreview, setBlobPreview] = useState<string | null>(realLogoUrl);
  const [oldLogoUrl, setOldLogoUrl] = useState<string>(logoUrl || "");
  const queryClient = useQueryClient();

  const form = useForm<EditBrandFormValues>({
    resolver: zodResolver(editBrandSchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: name,
      logoUrl: logoUrl || "",
    },
  });

  useEffect(() => {
    if (dialogOpen) {
      form.reset({
        name: name,
        logoUrl: logoUrl || "",
      });
    }
  }, [dialogOpen, name, logoUrl, form]);
  const trpc = useTRPC();
  const editBrandMutation = useMutation(
    trpc.brand.edit.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.brand.get.queryFilter());
        form.reset({
          name: data.name,
          logoUrl: data.logoUrl || "",
        });
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Brand created successfully!");
      },
      onError: (err) => {
        setError(err.message);
        appToast.error(err.message || "Something went wrong!");
      },
    }),
  );
  const { deleteImage } = useDeleteImage({
    onSuccess: () => {
      form.setValue("logoUrl", "");
      setFile(undefined);
      setBlobPreview(null);
      setOldLogoUrl("");
    },
    onError: (err) => {
      appToast.error(err.message);
    },
  });
  const { uploadImage } = useUploadImage({
    pathName: "brands",

    onSuccess: (url) => {
      form.setValue("logoUrl", url);
    },
    onError: (err) => {
      appToast.error(err.message);
    },
  });

  const onSubmit = async (data: EditBrandFormValues) => {
    setError(undefined);

    const logoUnchanged = !file && oldLogoUrl === data.logoUrl;
    const nameUnchanged = data.name === name; // `name` dari props

    // Tidak ada perubahan sama sekali
    if (logoUnchanged && nameUnchanged) return;

    if (file) {
      // Ada file baru → hapus logo lama dulu (jika ada), lalu upload
      if (oldLogoUrl) await deleteImage(oldLogoUrl);

      const url = await uploadImage(file);
      if (!url) return;

      data.logoUrl = url;
      setFile(undefined);
      setBlobPreview(null);
      setOldLogoUrl(url);
    } else if (!data.logoUrl && oldLogoUrl) {
      // Logo dihapus tanpa upload baru → hapus dari storage
      await deleteImage(oldLogoUrl);
      setOldLogoUrl("");
    }

    editBrandMutation.mutate({ ...data, id });
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil color="blue" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
              <DialogDescription>
                Edit the {name}&apos;s brand name and logo
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
                      disabled={editBrandMutation.isPending}
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
                  onRemove={() => {
                    form.setValue("logoUrl", "");
                    setFile(undefined);
                    setBlobPreview(null);
                  }}
                  disabled={editBrandMutation.isPending}
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
                  editBrandMutation.isPending ? <Spinner /> : <Pencil />
                }
                className={`${
                  editBrandMutation.isPending || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={editBrandMutation.isPending}
              >
                {editBrandMutation.isPending ? "Editing..." : "Edit Brand"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
