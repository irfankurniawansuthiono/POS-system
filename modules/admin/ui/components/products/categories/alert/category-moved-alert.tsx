import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { SendToBack } from "lucide-react";

export default function AlertCategoryMovedByDragging({
  sourceName,
  targetName,
  open,
  action,
  setDialogOpen,
}: {
  sourceName: string;
  targetName: string;
  open: boolean;
  action: () => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Category Move</DialogTitle>
          <DialogDescription>
            <p>
              This action will move <strong>{sourceName}</strong>{' '}
              to become a subcategory of <strong>{targetName}</strong>.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonWithIcon
            type="submit"
            variant="outline"
            className="select-none cursor-pointer"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </ButtonWithIcon>
          <ButtonWithIcon startIcon={<SendToBack/>} type="submit" variant="default" onClick={action}>
            Move
          </ButtonWithIcon>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
