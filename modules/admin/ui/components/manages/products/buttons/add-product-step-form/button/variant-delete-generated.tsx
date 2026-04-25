"use client";
import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

export default function VariantDeleteGenerated({
    onConfirm,
    rowValues,
}: {
    onConfirm: () => void;
    rowValues: Record<string, unknown>;
}) {
    const [open, setOpen] = useState(false);
    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
    };
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            onConfirm();
            setIsDeleting(false);
            setOpen(false);
        }, 300);
    };
    return (
        <DeleteConfirmationDialog
            isDeleting={isDeleting}
            confirmationKeyword={"DELETE " + Object.values(rowValues).join("-").toLocaleLowerCase()}
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Generated Variants"
            description="Are you sure you want to delete all generated variants? This action cannot be undone."
            onConfirm={handleDelete}
        >
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                <Trash size={16} />
            </Button>
        </DeleteConfirmationDialog>
    );
}
