"use client";

import { useEffect, useRef, useState } from "react";

import { getAuthUserApiV1UserAuthUserGet } from "@/client/sdk.gen";
import { useAuth } from "@/lib/auth";

export function useIsSuperuser(): boolean {
  const { loading: authLoading, user } = useAuth();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (authLoading || !user || hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    void (async () => {
      const response = await getAuthUserApiV1UserAuthUserGet();
      if (response.data?.is_superuser) {
        setIsSuperuser(true);
      }
    })();
  }, [authLoading, user]);

  return isSuperuser;
}
