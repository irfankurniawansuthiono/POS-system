import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Funnel, FunnelPlus, FunnelX } from "lucide-react";

export default function FilterBrands({
    isBrandsActive,
    setIsBrandsActive,
    setHasLogo,
    hasLogo,
}: {
    isBrandsActive: boolean | undefined;
    setIsBrandsActive: (isBrandsActive: boolean | undefined) => void;
    setHasLogo: (hasLogo: boolean | undefined) => void;
    hasLogo: boolean | undefined;
}) {
    const filtersCount = {
        isBrandsActive: isBrandsActive === undefined ? 0 : 1,
        hasLogo: hasLogo === undefined ? 0 : 1,
    };
    const filterTotal = Object.values(filtersCount).reduce((a, b) => a + b, 0);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <ButtonWithIcon variant="outline" startIcon={<FunnelPlus />}>
                    Filters
                    <span className="p-0 m-0">({filterTotal})</span>
                </ButtonWithIcon>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Funnel size={15} />
                        User Filters
                    </SheetTitle>
                    <SheetDescription>Filter by role, banned status, and email verification.</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 px-4">
                    <div className="flex items-end justify-end ">
                        <ButtonWithIcon
                            variant="default"
                            startIcon={<FunnelX />}
                            onClick={() => {
                                setIsBrandsActive(undefined);
                                setHasLogo(undefined);
                            }}
                        >
                            Clear Filters
                        </ButtonWithIcon>
                    </div>
                    {/* role list */}
                    <div className="flex flex-col gap-2">
                        <h1>Active Brand:</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={isBrandsActive === undefined ? "undefined" : isBrandsActive.toString()}
                                onValueChange={value =>
                                    setIsBrandsActive(value === "undefined" ? undefined : value === "true")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            isBrandsActive === undefined ? "All" : isBrandsActive ? "Yes" : "No"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                    <SelectItem value="undefined">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1>Has Brand&apos;s Logo:</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={hasLogo === undefined ? "undefined" : hasLogo.toString()}
                                onValueChange={value =>
                                    setHasLogo(value === "undefined" ? undefined : value === "true")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={hasLogo === undefined ? "All" : hasLogo ? "Yes" : "No"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                    <SelectItem value="undefined">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
