"use client";
import { DataTableTemplate } from "../../table";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import columns from "./columns";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import SortByBrands from "./button/sort-by-brand";
import FilterBrands from "./button/filter-brand";
export default function BransDataTable() {
  const trpc = useTRPC();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // sort by state
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // filter state
  const [isBrandsActive, setIsBrandsActive] = useState<boolean | undefined>(undefined);
  const [hasLogo, setHasLogo] = useState<boolean | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);

  const { data , isLoading, isError, error} = useQuery(trpc.brand.get.queryOptions({ limit, page, search: debouncedSearch, sortBy, sortDirection, isBrandsActive, hasLogo}));

  return (
    <DataTableTemplate filterComponents={<FilterBrands hasLogo={hasLogo} setHasLogo={setHasLogo} isBrandsActive={isBrandsActive} setIsBrandsActive={setIsBrandsActive} />} isError={isError} error={error} sortByComponents={<SortByBrands sortBy={sortBy} setSortBy={setSortBy} sortDirection={sortDirection} setSortDirection={setSortDirection} />}  onPageChange={(page: number) => setPage(page)}columns={columns(page, limit)} data={data?.brands || []} searchPlaceHolder="Search by name"  metadata={data?.meta} isLoading={isLoading} onNextPage={() => setPage(page + 1)} onPrevPage={() => setPage(page - 1)} onLimitChange={(limit) => setLimit(limit)} onSearchChange={(search) => setSearch(search)} />
  );
}
