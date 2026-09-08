"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ChangePasswordSection } from "@/components/account/ChangePasswordSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { LocalUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, provider } = useAuth();

  useEffect(() => {
    if (provider === "stack") {
      router.replace("/handler/account-settings");
    }
  }, [provider, router]);

  if (provider === "stack") {
    return null;
  }

  const email = (user as LocalUser | undefined)?.email;

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your sign-in credentials for this workspace.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Your sign-in email address for this installation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="account-email">Email address</Label>
              <p id="account-email" className="text-sm">
                {email ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Update the password you use to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordSection />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
