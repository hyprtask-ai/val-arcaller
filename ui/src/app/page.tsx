import { LandingPage } from "@/components/marketing/LandingPage";
import { getSignupEnabled } from "@/lib/auth/config";
import {
  getAuthenticatedAppHref,
  isAuthenticated,
} from "@/lib/auth/authenticatedRedirect";

export const dynamic = "force-dynamic";

export default async function Home() {
  const authenticated = await isAuthenticated();
  const signupEnabled = await getSignupEnabled();
  const appHref = authenticated ? await getAuthenticatedAppHref() : undefined;

  return (
    <LandingPage
      signupEnabled={signupEnabled}
      authenticated={authenticated}
      appHref={appHref}
    />
  );
}
