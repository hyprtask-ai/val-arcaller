"use client";

import { DoorClosedLocked, LogOut, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useIsSuperuser } from "@/hooks/useIsSuperuser";
import { useAuth } from "@/lib/auth";

import { UserInfo } from "./UserInfo";

export function UserMenuContent() {
  const router = useRouter();
  const { logout, provider } = useAuth();
  const isSuperuser = useIsSuperuser();

  const accountSettingsPath =
    provider === "stack" ? "/handler/account-settings" : "/account-settings";

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo showEmail />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => router.push(accountSettingsPath)}
          className="cursor-pointer"
        >
          <UserRound className="mr-2 h-4 w-4" />
          Account Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          Platform Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      {isSuperuser && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push("/superadmin")}
              className="cursor-pointer"
            >
              <DoorClosedLocked className="mr-2 h-4 w-4" />
              Back Office
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </DropdownMenuItem>
    </>
  );
}
