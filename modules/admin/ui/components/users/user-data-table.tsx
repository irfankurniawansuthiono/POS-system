"use client";
import { DataTableTemplate } from "../table";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import columns from "./columns";
export default function UsersDataTable() {
  const trpc = useTRPC();
  const { data = [], isLoading } = useQuery(trpc.user.list.queryOptions());
  return (
    <DataTableTemplate columns={columns} data={data} isLoading={isLoading} />
  );
}
