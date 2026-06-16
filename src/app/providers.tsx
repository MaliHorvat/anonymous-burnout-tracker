"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/setup"
      signUpFallbackRedirectUrl="/setup"
    >
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
