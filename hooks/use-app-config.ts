"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const useAppConfig = () => {
    const trpc = useTRPC();

    return useQuery(
        trpc.appConfig.get.queryOptions(undefined, {
            staleTime: Infinity,
        }),
    );
};
