import { redirect } from "next/navigation";

import { getSignupEnabled } from "@/lib/auth/config";

import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const signupEnabled = await getSignupEnabled();
  if (!signupEnabled) {
    redirect("/auth/login");
  }

  return <SignupForm />;
}
