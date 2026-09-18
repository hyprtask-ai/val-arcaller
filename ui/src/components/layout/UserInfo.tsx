"use client";

import type { LocalUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function resolveIdentity(user: ReturnType<typeof useAuth>["user"]) {
  if (!user) {
    return { name: "User", email: undefined as string | undefined };
  }

  const name =
    ("displayName" in user && user.displayName) ||
    ("name" in user && (user as LocalUser).name) ||
    ("primaryEmail" in user && user.primaryEmail) ||
    ("email" in user && (user as LocalUser).email) ||
    "User";

  const email =
    ("primaryEmail" in user && user.primaryEmail) ||
    ("email" in user && (user as LocalUser).email) ||
    undefined;

  return { name, email };
}

export function UserInfo({
  showEmail = false,
  className,
}: {
  showEmail?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const { name, email } = resolveIdentity(user);

  return (
    <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
        {userInitials(name)}
      </div>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">{name}</span>
        {showEmail && email && (
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        )}
      </div>
    </div>
  );
}
