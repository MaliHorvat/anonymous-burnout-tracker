import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedApi = createRouteMatcher(["/api/dashboard(.*)", "/api/organization(.*)"]);

// Samo API zaščitimo na edge — strani /sign-in, /dashboard itd. delujejo brez handshake napake.
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedApi(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/api/dashboard(.*)", "/api/organization(.*)"],
};
