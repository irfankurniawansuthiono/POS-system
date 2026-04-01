"use client";
import { DataTableTemplate } from "../../table";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import columns from "./columns";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import SortByBrands from "./button/sort-by-brand";
export default function BransDataTable() {
  const trpc = useTRPC();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // sort by state
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(search, 500);

  const { data , isLoading, isError, error} = useQuery(trpc.brand.get.queryOptions({ limit, page, search: debouncedSearch, sortBy, sortDirection}));

  return (
    <DataTableTemplate isError={isError} error={error} sortByComponents={<SortByBrands sortBy={sortBy} setSortBy={setSortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} />}  onPageChange={(page: number) => setPage(page)}columns={columns(page, limit)} data={data?.brands || []} searchPlaceHolder="Search by name"  metadata={data?.meta} isLoading={isLoading} onNextPage={() => setPage(page + 1)} onPrevPage={() => setPage(page - 1)} onLimitChange={(limit) => setLimit(limit)} onSearchChange={(search) => setSearch(search)} />
  );
}
