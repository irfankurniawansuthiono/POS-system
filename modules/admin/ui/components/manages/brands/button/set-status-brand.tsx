import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";
import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function SetBrandStatus({
  status,
  id,
}: {
  status: boolean;
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const setStatusMutation = useMutation(
    trpc.brand.setStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.brand.get.queryFilter());
        setOpen(false);
      },
      onError: (err) => {
        console.error(err);
        setOpen(false);
      },
    }),
  );

  const handleConfirm = () => {
    setStatusMutation.mutate({ id, status: !status });
  };
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="select-none cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {status ? (
              <Circle className="text-red-500" />
            ) : (
              <Circle className="text-green-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {status ? "Disable Brand" : "Enable Brand"}
        </TooltipContent>
      </Tooltip>
      <DeleteConfirmationDialog
        confirmationKeyword={status ? "DISABLE" : "ENABLE"}
        confirmationText={status ? "Disable Brand" : "Enable Brand"}
        isDeleting={setStatusMutation.isPending}
        onConfirm={handleConfirm}
        description={
          status
            ? "Are you sure you want to disable this brand?"
            : "Are you sure you want to enable this brand?"
        }
        open={open}
        onOpenChange={setOpen}
        title={status ? "Disable Brand" : "Enable Brand"}
      />
    </>
  );
}
