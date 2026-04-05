"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { FilePlus, Folder, FolderPlus } from "lucide-react";
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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { AddCategoryFormValues, addCategorySchema } from "@/lib/form-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { appToast } from "@/components/custom/app-toast";
import { zodResolver } from "@hookform/resolvers/zod";
export default function AddSubCategories({
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
  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    mode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      name: "",
    },
  });
  const trpc = useTRPC();
  const createCategoryMutation = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.category.get.queryFilter());
        form.reset();
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Sub Category created successfully!");
      },
      onError: (err) => {
        setError(err.message);
        appToast.error("Something went wrong!");
      },
    }),
  );

  const onSubmit = (data: AddCategoryFormValues) => {
    createCategoryMutation.mutate({
      ...data,
      parentId,
      categoryIndex: level,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-sm" onClick={(e)=> e.stopPropagation()}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Sub Category</DialogTitle>
              <DialogDescription>
                Add new sub category for {parentName}
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
                    New Sub Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter sub category name"
                      {...field}
                      disabled={createCategoryMutation.isPending}
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
                  createCategoryMutation.isPending ? <Spinner /> : <FilePlus />
                }
                className={`${
                  createCategoryMutation.isPending || !form.formState.isValid
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={
                  createCategoryMutation.isPending || !form.formState.isValid
                }
              >
                {createCategoryMutation.isPending
                  ? "Adding..."
                  : "Add Sub Category"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
