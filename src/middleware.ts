import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/setup(.*)",
  "/api/dashboard(.*)",
  "/api/organization(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Clerk middleware samo na straneh, ki ga potrebujejo — javna anketa (/s/*) in /api/submit brez handshake.
export const config = {
  matcher: [
    "/dashboard(.*)",
    "/setup(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/dashboard(.*)",
    "/api/organization(.*)",
  ],
};
