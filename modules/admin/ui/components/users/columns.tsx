import { User } from "@/app/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import DeleteUser from "./button/delete-user";
import EditUser from "./button/edit-user";
import ResetPasswordUser from "./button/reset-password-user";
import { role } from "../../config/auth/role.user";
import UserRoleBadge from "./role-badge-user";

const columns = (page: number, limit: number): ColumnDef<User>[] => [
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
        <img
          src={row.original.image}
          alt={row.original.name!}
          className="h-10 w-10 rounded-md"
        />
      ) : (
        <img
          src="https://placehold.co/100x100"
          alt="Profile Picture"
          className="h-10 w-10 rounded-md"
        />
      ),
  },
  {
    accessorKey: "role",
    header: "Roles",
    cell: ({ row }) => {
      const userRole = row.original.role!;
      return (<UserRoleBadge role={userRole} />)
    },
  },
  {
    accessorKey: "banned",
    header: "Banned",
    cell: ({ row }) =>
      row.original.banned ? <Check color="green" /> : <X color="red" />,
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
    cell: ({ row }) => (row.original.banReason ? row.original.banReason : "-"),
  },
  {
    accessorKey: "verified",
    header: "Email Verified",
    cell: ({ row }) =>
      row.original.emailVerified ? <Check color="green" /> : <X color="red" />,
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
          <EditUser data={{
            id: row.original.id,
            name: row.original.name!,
            email: row.original.email!,
            role: row.original.role!
          }} />
          <ResetPasswordUser id={row.original.id} />
          <DeleteUser id={row.original.id}/>
        </div>
      )
    },
  },
];

export default columns;
