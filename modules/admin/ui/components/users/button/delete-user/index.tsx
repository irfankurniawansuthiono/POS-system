import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useState } from "react";
import { admin } from "@/lib/auth-client";

export default function DeleteUser({
  id,
}: {
  id: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const onConfirm = async () => {
    setLoading(true);
    const { data : status, error} = await admin.removeUser({
      userId: id,
    });
    if (error) {
      console.error(error);
      return;
    }
    if(status.success){
        setLoading(false);
        queryClient.invalidateQueries(trpc.user.get.queryFilter());
        setOpen(false);
    }

  };
  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete User"
      description="Are you sure you want to delete this user?"
      onConfirm={onConfirm}
      isDeleting={loading}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash color="red" />
        </Button>
      </AlertDialogTrigger>
    </DeleteConfirmationDialog>
  );
}
