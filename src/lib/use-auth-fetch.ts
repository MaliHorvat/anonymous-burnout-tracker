"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

type AuthFetchInit = RequestInit & {
  /** Osveži Clerk žeton (npr. po ustvarjanju organizacije). */
  skipCache?: boolean;
};

export function useAuthFetch() {
  const { getToken } = useAuth();

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init?: AuthFetchInit) => {
      const { skipCache, ...fetchInit } = init ?? {};
      const token = await getToken(skipCache ? { skipCache: true } : undefined);
      const headers = new Headers(fetchInit.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return fetch(input, {
        ...fetchInit,
        credentials: "same-origin",
        headers,
      });
    },
    [getToken],
  );

  return authFetch;
}
