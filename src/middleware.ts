import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk session na vseh straneh/API — brez auth.protect(), da API vedno vrne JSON (ne 404/HTML).
// Avtentikacija je v posameznih route handlerjih.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
