"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { FilePenLine, Folder } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

import {EditCategoryFormValues, editCategorySchema } from "@/lib/form-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { appToast } from "@/components/custom/app-toast";
import { zodResolver } from "@hookform/resolvers/zod";
export default function UpdateCurrentCategory({
  parentId,
  parentName,
  level,
  open, 
  setDialogOpen
}: {
  parentId: string;
  parentName: string;
  level: number;
  open: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [error, setError] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: parentName,
    },
  });
  useEffect(() => {
    form.reset({
      name: parentName,
    });
  }, [open, parentName, form]);
  const trpc = useTRPC();
  const editCategoryMutation = useMutation(
    trpc.category.edit.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.category.get.queryOptions());
        form.reset();
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Category updated successfully!");
      },
      onError: (err) => {
        setError(err.message);
        appToast.error("Something went wrong!");
      },
    }),
  );


  const onSubmit = (data: EditCategoryFormValues) => {
    editCategoryMutation.mutate({
        id: parentId,
      ...data,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit {level > 0 ? "Sub Category" : "Category"}</DialogTitle>
              <DialogDescription>
               Edit {level > 0 ? "Sub Category" : "Category"} For {parentName}
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
                  <FormLabel>
                    <Folder className="inline" size={15} />
                    Edit {level > 0 ? "Sub Category" : "Category"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={level > 0 ? "Enter sub category name" : "Enter category name"}
                      {...field}
                      disabled={editCategoryMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
                  editCategoryMutation.isPending ? <Spinner /> : <FilePenLine />
                }
                className={`${
                  editCategoryMutation.isPending || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={
                  editCategoryMutation.isPending  || !form.formState.isValid
                }
              >
                {editCategoryMutation.isPending 
                  ? "Editing..."
                  : "Edit Category"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
