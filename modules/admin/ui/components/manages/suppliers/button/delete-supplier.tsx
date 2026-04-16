import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { appToast } from "@/components/custom/app-toast";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function DeleteSupplier({ id }: { id: string }) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const deleteSupplierMutation = useMutation(
        trpc.supplier.delete.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(trpc.supplier.get.queryFilter());
                setOpen(false);
                appToast.success("Supplier deleted successfully!");
            },
            onError: err => {
                console.error(err);
                appToast.error("Something went wrong!" + (err instanceof Error ? err.message : ""));
            },
        }),
    );

    return (
        <DeleteConfirmationDialog
            open={open}
            onOpenChange={setOpen}
            title="Delete Supplier"
            description="Are you sure you want to delete this supplier?"
            onConfirm={() => deleteSupplierMutation.mutate({ id })}
            isDeleting={deleteSupplierMutation.isPending}
        >
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Trash color="red" />
                </Button>
            </AlertDialogTrigger>
        </DeleteConfirmationDialog>
    );
}
