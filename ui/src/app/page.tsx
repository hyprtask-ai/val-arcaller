import { LandingPage } from "@/components/marketing/LandingPage";
import { getSignupEnabled } from "@/lib/auth/config";
import {
  isAuthenticated,
  redirectAuthenticatedUser,
} from "@/lib/auth/authenticatedRedirect";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (await isAuthenticated()) {
    await redirectAuthenticatedUser();
  }

  const signupEnabled = await getSignupEnabled();
  return <LandingPage signupEnabled={signupEnabled} />;
}
