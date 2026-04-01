import { Brand } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import SetBrandStatus from "./button/set-status-brand";
import EditBrand from "./button/edit-brand";
import DeleteBrand from "./button/delete-brand";

const columns = (page: number, limit: number): ColumnDef<Brand>[] => [
  {
    accessorKey: "no",
    header: "No.",
    enableHiding: false,
    cell: ({ row }) => (page - 1) * limit + row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Full Name",
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleString(),
  },
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) =>
      row.original.logoUrl ? (
        <img
          src={row.original.logoUrl}
          alt={row.original.name!}
          className="aspect-auto max-w-10 rounded-md select-none pointer-events-none"
        />
      ) : null,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant="default" className="bg-green-500">
          Active
        </Badge>
      ) : (
        <Badge variant="default" className="bg-red-500">
          Inactive
        </Badge>
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
          <SetBrandStatus id={row.original.id} status={row.original.isActive} />
          <EditBrand id={row.original.id} name={row.original.name} logoUrl={row.original.logoUrl || null} />
          <DeleteBrand id={row.original.id} name={row.original.name} logoUrl={row.original.logoUrl || null} />
        </div>
      );
    },
  },
];

export default columns;
