"use client";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Folder, FolderPlus } from "lucide-react";
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
export default function AddCategories() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
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
        queryClient.invalidateQueries(trpc.category.get.queryOptions());
        form.reset();
        setDialogOpen(false);
        setError(undefined);
        appToast.success("Category created successfully!");
      },
      onError: (err) => {
        // jika eror name unique dari prisma client
        if (err.message.includes("Unique constraint failed on the fields")) {
          setError("Category name already exists!");
          appToast.error("Category name already exists!");
          return;
        }
        setError(err.message);
        appToast.error("Something went wrong!");
      },
    }),
  );

  const onSubmit = (data: AddCategoryFormValues) => {
    createCategoryMutation.mutate(data);
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <ButtonWithIcon startIcon={<FolderPlus />} variant="default">
          Add New Category
        </ButtonWithIcon>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Add new category to your store products
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
                    New Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
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
                  createCategoryMutation.isPending ? (
                    <Spinner />
                  ) : (
                    <FolderPlus />
                  )
                }
                className={`${
                  createCategoryMutation.isPending
                    ? "cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                disabled={
                  createCategoryMutation.isPending
                }
              >
                {createCategoryMutation.isPending
                  ? "Adding..."
                  : "Add Category"}
              </ButtonWithIcon>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
