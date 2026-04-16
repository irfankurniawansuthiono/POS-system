"use client";
import type { PaymentTerm } from "@/app/generated/prisma";
import { useDebounce } from "@/hooks/use-debounce";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTableTemplate } from "../../table";
import FilterSuppliers from "./button/filter-supplier";
import SortBySuppliers from "./button/sort-by-supplier";
import columns from "./columns";

export default function SuppliersDataTable() {
    const trpc = useTRPC();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    // filter state

    // sort by state
    const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt" | "updatedAt">("updatedAt");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // filter state
    const [city, setCity] = useState<string | undefined>(undefined);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerm | undefined>(undefined);
    const [hasTempo, setHasTempo] = useState<boolean | undefined>(undefined);
    const [hasBank, setHasBank] = useState<boolean | undefined>(undefined);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError, error } = useQuery(
        trpc.supplier.get.queryOptions({
            limit,
            page,
            search: debouncedSearch,
            sortBy,
            sortDirection,
            city,
            paymentTerms,
            hasTempo,
            hasBank,
        }),
    );
    const cityContent =
        [...new Set(data?.suppliersCity?.map(({ city }) => city).filter((c): c is string => c !== null))].sort((a, b) =>
            a.localeCompare(b),
        ) ?? [];
    return (
        <DataTableTemplate
            isError={isError}
            error={error}
            sortByComponents={
                <SortBySuppliers
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                />
            }
            filterComponents={
                <FilterSuppliers
                    cityContent={cityContent}
                    city={city}
                    setCity={setCity}
                    paymentTerms={paymentTerms}
                    setPaymentTerms={setPaymentTerms}
                    hasTempo={hasTempo}
                    setHasTempo={setHasTempo}
                    hasBank={hasBank}
                    setHasBank={setHasBank}
                />
            }
            onPageChange={(page: number) => setPage(page)}
            columns={columns(page, limit)}
            data={data?.suppliers || []}
            searchPlaceHolder="Search by name, email, company name, contact person, city, address, phone"
            metadata={data?.meta}
            isLoading={isLoading}
            onNextPage={() => setPage(page + 1)}
            onPrevPage={() => setPage(page - 1)}
            onLimitChange={limit => setLimit(limit)}
            onSearchChange={search => setSearch(search)}
        />
    );
}
