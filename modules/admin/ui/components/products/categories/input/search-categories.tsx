"use client";
import { InputWithIcon } from "@/components/custom/input-with-icon";
import { Search } from "lucide-react";

export default function SearchCategories({
    setQuery,
    isLoading, 
}:{
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
        <InputWithIcon variant={"outline"}>
        <Search size={16} />
        <input disabled={isLoading} type="search" onChange={(e)=> setQuery(e.target.value)} placeholder="Search categories" />
        </InputWithIcon>
    </div>
  );
}
