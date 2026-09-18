import "server-only";

import { isNextRouterError } from "next/dist/client/components/is-next-router-error";
import { redirect } from "next/navigation";

import { getWorkflowCountApiV1WorkflowCountGet } from "@/client/sdk.gen";
import logger from "@/lib/logger";
import { getRedirectUrl } from "@/lib/utils";

import {
  getServerAccessToken,
  getServerAuthProvider,
  getServerUser,
} from "./server";

/** App entry URL for a signed-in user (shared by redirects and marketing CTAs). */
export async function getAuthenticatedAppHref(): Promise<string> {
  const authProvider = await getServerAuthProvider();
  const user = await getServerUser();

  if (authProvider === "stack" && user && "getAuthJson" in user) {
    const token = await user.getAuthJson();
    const permissions =
      "listPermissions" in user && "selectedTeam" in user
        ? (await user.listPermissions(user.selectedTeam!)) ?? []
        : [];
    return getRedirectUrl(token?.accessToken ?? "", permissions);
  }

  if (authProvider === "local") {
    try {
      const accessToken = await getServerAccessToken();
      if (accessToken) {
        const countResponse = await getWorkflowCountApiV1WorkflowCountGet({
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (countResponse.data && countResponse.data.active > 0) {
          return "/workflow";
        }
        return "/workflow/create";
      }
    } catch (error) {
      if (isNextRouterError(error)) {
        throw error;
      }
      logger.error("[getAuthenticatedAppHref] workflow count failed:", error);
      return "/workflow/create";
    }
  }

  return "/overview";
}

/** Where an authenticated user should land after sign-in or when visiting auth pages. */
export async function redirectAuthenticatedUser(): Promise<never> {
  redirect(await getAuthenticatedAppHref());
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  if (user) {
    return true;
  }
  if ((await getServerAuthProvider()) === "local") {
    return Boolean(await getServerAccessToken());
  }
  return false;
}
