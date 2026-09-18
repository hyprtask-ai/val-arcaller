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

/** Where an authenticated user should land after sign-in or when visiting auth pages. */
export async function redirectAuthenticatedUser(): Promise<never> {
  const authProvider = await getServerAuthProvider();
  const user = await getServerUser();

  if (authProvider === "stack" && user && "getAuthJson" in user) {
    const token = await user.getAuthJson();
    const permissions =
      "listPermissions" in user && "selectedTeam" in user
        ? (await user.listPermissions(user.selectedTeam!)) ?? []
        : [];
    redirect(await getRedirectUrl(token?.accessToken ?? "", permissions));
  }

  if (authProvider === "local") {
    try {
      const accessToken = await getServerAccessToken();
      if (accessToken) {
        const countResponse = await getWorkflowCountApiV1WorkflowCountGet({
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (countResponse.data && countResponse.data.active > 0) {
          redirect("/workflow");
        }
        redirect("/workflow/create");
      }
    } catch (error) {
      if (isNextRouterError(error)) {
        throw error;
      }
      logger.error("[redirectAuthenticatedUser] workflow count failed:", error);
      redirect("/workflow/create");
    }
  }

  redirect("/overview");
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
