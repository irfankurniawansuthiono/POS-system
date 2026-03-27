"use client";
import { DataTableTemplate } from "../table";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import columns from "./columns";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
export default function UsersDataTable() {
  const trpc = useTRPC();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data , isLoading } = useQuery(trpc.user.get.queryOptions({ limit, page, search: debouncedSearch }));

  return (
    <DataTableTemplate onPageChange={(page: number) => setPage(page)}columns={columns(page, limit)} data={data?.users || []} searchPlaceHolder="Search by name or email"  metadata={data?.meta} isLoading={isLoading} onNextPage={() => setPage(page + 1)} onPrevPage={() => setPage(page - 1)} onLimitChange={(limit) => setLimit(limit)} onSearchChange={(search) => setSearch(search)} />
  );
}
