import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import CopyButton from "@/components/custom/copy-button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

type Props = {
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
  knownAs: string;
  companyName: string;
};

export default function BankInfoButton({
  bankName,
  knownAs,
  companyName,
  bankAccountNumber,
  accountHolderName,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PiggyBank />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-105 [&>button:last-child]:hidden rounded-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-5">
              <PiggyBank size={50} />
              <div>
                <DialogTitle>
                  <CardTitle className="flex items-center gap-5 text-3xl">
                    Bank Information
                  </CardTitle>
                </DialogTitle>
                <CardDescription>
                  The bank information for {knownAs}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <div>
              <h1 className="flex items-center gap-2">PT/CV Name:</h1>
              <div className="flex items-center justify-between">
                <strong className="text-xl">{companyName}</strong>{" "}
              </div>
            </div>
            <Separator />
            <div>
              <h1 className="flex items-center gap-2">Bank Name:</h1>
              <div className="flex items-center justify-between">
                <strong className="text-xl">{bankName}</strong>{" "}
                <CopyButton text={bankName} />
              </div>
            </div>
            <Separator />
            <div>
              <h1 className="flex items-center gap-2">Bank Account Number:</h1>
              <div className="flex items-center justify-between">
                <strong className="text-xl">{bankAccountNumber}</strong>{" "}
                <CopyButton text={bankAccountNumber} />
              </div>
            </div>
            <Separator />

            <div>
              <h1 className="flex items-center gap-2">Account Holder Name:</h1>
              <div className="flex items-center justify-between">
                <strong className="text-xl">{accountHolderName}</strong>{" "}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
