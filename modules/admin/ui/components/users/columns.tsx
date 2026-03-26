import { User } from "@/app/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
  },
  
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleString(),
  },
  {
    accessorKey: "image",
    header: "Profile Picture",
    cell: ({ row }) =>
      row.original.image ? (
        <img src={row.original.image} />
      ) : (
        <img src="https://placehold.co/100x100" />
      ),
  },
  {
    accessorKey: "role",
    header: "Roles",
  },
  {
    accessorKey: "banned",
    header: "Banned",
    cell: ({ row }) => (row.original.banned ? <Check color="green"/> : <X color="red"/>),
  },
  {
    accessorKey: "banExpires",
    header: "Ban Expires",
    cell: ({ row }) =>
      row.original.banExpires ? row.original.banExpires.toLocaleString() : "-",
  },
  {
    accessorKey: "banReason",
    header: "Ban Reason",
    size: 200,
    cell: ({ row }) =>
  row.original.banReason ? (
      row.original.banReason
  ) : (
    "-"
  ),
  },
  {
    accessorKey: "verified",
    header: "Email Verified",
    cell: ({ row }) => (row.original.emailVerified ? <Check color="green"/> : <X color="red"/>),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => row.original.updatedAt.toLocaleString(),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
        <h1>yesy</h1>
    )
  }
];

export default columns;
