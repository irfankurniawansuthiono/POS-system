import { Supplier } from "@/app/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import BankInfoButton from "./button/bank-info";

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
      row.original.accountHolderName && row.original.name && row.original.companyName? (
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
          {/* <EditUser data={{
            id: row.original.id,
            name: row.original.name!,
            email: row.original.email!,
            role: row.original.role!
          }} />
          <ResetPasswordUser id={row.original.id} />
          <DeleteUser id={row.original.id}/> */}
        </div>
      );
    },
  },
];

export default columns;
