import { Supplier } from "@/app/generated/prisma";
import type { AddSupplierFormValues } from "@/lib/form-schema";
import { ColumnDef } from "@tanstack/react-table";
import BankInfoButton from "./button/bank-info";
import DeleteSupplier from "./button/delete-supplier";
import EditSupplier from "./button/edit-supplier";

const columns = (page: number, limit: number): ColumnDef<Supplier>[] => [
    {
        accessorKey: "no",
        header: "No.",
        enableHiding: false,
        cell: ({ row }) => (page - 1) * limit + row.index + 1,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => row.original.createdAt.toLocaleString(),
    },
    {
        accessorKey: "contactPerson",
        header: "CP Name",
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "name",
        header: "Known As",
    },
    {
        accessorKey: "companyName",
        header: "PT/CV Name",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "gmapsUrl",
        header: "Google Maps",
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => (row.original.notes ? row.original.notes : "-"),
    },
    {
        accessorKey: "paymentTerm",
        header: "Payment Term",
        cell: ({ row }) => row.original.paymentTerm,
    },
    {
        accessorKey: "tempoDays",
        header: "Tempo Days",
        cell: ({ row }) => (row.original.tempoDays ? row.original.tempoDays : "-"),
    },
    {
        accessorKey: "Bank Info",
        header: "Bank Info",
        cell: ({ row }) =>
            row.original.bankName &&
            row.original.bankAccountNumber &&
            row.original.accountHolderName &&
            row.original.name &&
            row.original.companyName ? (
                <BankInfoButton
                    companyName={row.original.companyName!}
                    bankName={row.original.bankName!}
                    bankAccountNumber={row.original.bankAccountNumber!}
                    accountHolderName={row.original.accountHolderName!}
                    knownAs={row.original.name!}
                />
            ) : (
                "-"
            ),
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => row.original.updatedAt.toLocaleString(),
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <EditSupplier id={row.original.id} data={row.original as AddSupplierFormValues} />
                    <DeleteSupplier id={row.original.id} name={row.original.name} />
                </div>
            );
        },
    },
];

export default columns;
