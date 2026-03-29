/*
filter by roles
filter by banned status(banned or not)
filter by email verified or not
*/

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonWithIcon } from "@/components/custom/button-with-icon";
import { Check, Funnel, FunnelPlus, X } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { roleList } from "../../../config/auth/role.user";
import { useEffect } from "react";

export default function FilterUsers({
  rolesFilter,
  setRolesFilter,
  bannedFilter,
  setBannedFilter,
  verifiedFilter,
  setVerifiedFilter,
}: {
  rolesFilter: (typeof roleList)[number][];
  setRolesFilter: (rolesFilter: (typeof roleList)[number][]) => void;
  bannedFilter: boolean | undefined;
  setBannedFilter: (bannedFilter: boolean | undefined) => void;
  verifiedFilter: boolean | undefined;
  setVerifiedFilter: (verifiedFilter: boolean | undefined) => void;
}) {
  useEffect(() => {
    console.log(rolesFilter);
  }, [rolesFilter]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ButtonWithIcon variant="outline" startIcon={<FunnelPlus />}>
          Filter
        </ButtonWithIcon>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Funnel size={15} />
            User Filters
          </SheetTitle>
          <SheetDescription>
            Filter by role, banned status, and email verification.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {/* role list */}
          <div className="flex flex-col gap-2">
            <h1>Role:</h1>
            <div className="space-y-2 space-x-2">
              {roleList.map((role) => (
                <Toggle
                  key={role}
                  variant="outline"
                  aria-label={role}
                  pressed={rolesFilter.includes(role)}
                  onPressedChange={(pressed) => {
                    setRolesFilter(
                      pressed
                        ? [...rolesFilter, role]
                        : rolesFilter.filter((r: string) => r !== role),
                    );
                  }}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Toggle>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Banned:</h1>
            <div className="flex items-center gap-2">
              <Toggle
                variant="outline"
                aria-label="Banned"
                pressed={bannedFilter === true}
                onPressedChange={(pressed) =>
                  setBannedFilter(pressed ? true : undefined)
                }
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center"
              >
                {bannedFilter === true ? <Check /> : <X />}
                {bannedFilter === true ? "Yes" : "No"}
              </Toggle>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1>Email Verified:</h1>
            <div className="flex items-center gap-2">
              <Toggle
                variant="outline"
                aria-label="Banned"
                pressed={verifiedFilter === true}
                onPressedChange={(pressed) =>
                  setVerifiedFilter(pressed ? true : undefined)
                }
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center"
              >
                {verifiedFilter === true ? <Check /> : <X />}
                {verifiedFilter === true ? "Yes" : "No"}
              </Toggle>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
