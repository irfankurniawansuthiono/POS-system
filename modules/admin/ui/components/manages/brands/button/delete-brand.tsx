import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { appToast } from "@/components/custom/app-toast";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteImage } from "@/hooks/use-remove-image";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function DeleteBrand({
  id,
  name,
  logoUrl,
}: {
  id: string;
  name: string;
  logoUrl: string | null;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const deleteBrandMutation = useMutation(trpc.brand.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.brand.get.queryFilter());
      setOpen(false);
       appToast.success("Brand deleted successfully!");
    },
    onError: (err) => {
      console.error(err);
      appToast.error("Something went wrong!");
    },
  }));
  const {deleteImage} = useDeleteImage({onSuccess: () => {
    deleteBrandMutation.mutate({ id });
    setOpen(false);
    appToast.success("Brand deleted successfully!");
  }, onError: (err) => {
    appToast.error(err.message);
  }});
  const handleDelete = () => {
    if (logoUrl) {
     return  deleteImage(logoUrl);
    }
    deleteBrandMutation.mutate({ id });
  }
  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      onConfirm={handleDelete}
      title="Delete Brand"
      description={`Are you sure you want to delete ${name}'s brand?`}
      isDeleting={deleteBrandMutation.isPending}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash color="red" />
        </Button>
      </AlertDialogTrigger>
    </DeleteConfirmationDialog>
  );
}
