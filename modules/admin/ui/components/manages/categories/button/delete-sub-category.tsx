import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { appToast } from "@/components/custom/app-toast";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function DeleteSubCategory({
  id,
  open, 
  setOpen,
  level,
  parentName,
}: {
  id: string;
  open: boolean;
  parentName: string;
  level: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteCategoryMutation = useMutation(trpc.category.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.category.get.queryFilter());
      setOpen(false);
       appToast.success(level > 0 ? "Sub Category deleted successfully!" : "Category deleted successfully!");
    },
    onError: (err) => {
      console.error(err);
      appToast.error("Something went wrong!");
    },
  }));

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title={level > 0 ? "Delete Sub Category" : "Delete Category"}
      description={"Are you sure you want to delete this " + (level > 0 ? "sub category " : "category ") + parentName + "?"}
      onConfirm={() => deleteCategoryMutation.mutate({ id })}
      isDeleting={deleteCategoryMutation.isPending}
    />
      
  );
}
