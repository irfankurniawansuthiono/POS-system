import { Brand } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

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
    enableHiding:false
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
    cell: ({ row }) => (row.original.isActive ? <Badge variant="default" className="bg-green-500">Active</Badge>: <Badge variant="default" className="bg-red-500">Inactive</Badge>),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => row.original.updatedAt.toLocaleString(),
  }
];

export default columns;

