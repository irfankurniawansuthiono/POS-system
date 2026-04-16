import type { PaymentTerm } from "@/app/generated/prisma";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Funnel, FunnelPlus, FunnelX } from "lucide-react";

export default function FilterSuppliers({
    cityContent,
    city,
    setCity,
    paymentTerms,
    setPaymentTerms,
    hasTempo,
    setHasTempo,
    setHasBank,
    hasBank,
}: {
    cityContent: string[];
    city: string | undefined;
    setCity: (city: string | undefined) => void;
    paymentTerms: PaymentTerm | undefined;
    setPaymentTerms: (paymentTerms: PaymentTerm | undefined) => void;
    hasTempo: boolean | undefined;
    setHasTempo: (hasTempo: boolean | undefined) => void;
    hasBank: boolean | undefined;
    setHasBank: (hasBank: boolean | undefined) => void;
}) {
    const filtersCount = {
        city: city === undefined ? 0 : 1,
        paymentTerms: paymentTerms === undefined ? 0 : 1,
        hasTempo: hasTempo === undefined ? 0 : 1,
        hasBank: hasBank === undefined ? 0 : 1,
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
                        Supplier Filters
                    </SheetTitle>
                    <SheetDescription>Filter suppliers by various criteria.</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 px-4">
                    <div className="flex items-end justify-end ">
                        <ButtonWithIcon
                            variant="default"
                            startIcon={<FunnelX />}
                            onClick={() => {
                                setCity(undefined);
                                setPaymentTerms(undefined);
                                setHasTempo(undefined);
                                setHasBank(undefined);
                            }}
                        >
                            Clear Filters
                        </ButtonWithIcon>
                    </div>
                    {/* role list */}
                    <div className="flex flex-col gap-2">
                        <h1>City :</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={city ?? "undefined"}
                                onValueChange={value => setCity(value === "undefined" ? undefined : value)}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder={city === undefined ? "All" : city} />
                                </SelectTrigger>
                                <SelectContent className="w-1/2">
                                    <SelectItem value="undefined">All</SelectItem>
                                    {cityContent.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1>Has Tempo :</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={hasTempo === undefined ? "undefined" : hasTempo.toString()}
                                onValueChange={value =>
                                    setHasTempo(value === "undefined" ? undefined : value === "true")
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue
                                        placeholder={hasTempo === undefined ? "All" : hasTempo ? "Yes" : "No"}
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
                        <h1>Has Bank :</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={hasBank === undefined ? "undefined" : hasBank.toString()}
                                onValueChange={value =>
                                    setHasBank(value === "undefined" ? undefined : value === "true")
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder={hasBank === undefined ? "All" : hasBank ? "Yes" : "No"} />
                                </SelectTrigger>
                                <SelectContent className="w-1/2">
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                    <SelectItem value="undefined">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1>Payment Terms :</h1>
                        <div className="flex items-center gap-2">
                            <Select
                                value={paymentTerms || "undefined"}
                                onValueChange={value =>
                                    setPaymentTerms(value === "undefined" ? undefined : (value as PaymentTerm))
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder={paymentTerms || "All"} />
                                </SelectTrigger>
                                <SelectContent className="w-1/2">
                                    <SelectItem value="undefined">All</SelectItem>
                                    <SelectItem value="CASH">CASH</SelectItem>
                                    <SelectItem value="TEMPO">TEMPO</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
