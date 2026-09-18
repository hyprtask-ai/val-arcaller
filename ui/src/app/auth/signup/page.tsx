import { redirect } from "next/navigation";

import {
  isAuthenticated,
  redirectAuthenticatedUser,
} from "@/lib/auth/authenticatedRedirect";
import { getSignupEnabled } from "@/lib/auth/config";

import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await isAuthenticated()) {
    await redirectAuthenticatedUser();
  }

  const signupEnabled = await getSignupEnabled();
  if (!signupEnabled) {
    redirect("/auth/login");
  }

  return <SignupForm />;
}
