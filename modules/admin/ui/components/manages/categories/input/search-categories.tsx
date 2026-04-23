"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function SearchCategories({
    setQuery,
    isLoading,
}: {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <InputGroup>
                <InputGroupAddon>
                    <Search size={16} />
                </InputGroupAddon>
                <InputGroupInput
                    disabled={isLoading}
                    type="search"
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search categories"
                />
            </InputGroup>
        </div>
    );
}
