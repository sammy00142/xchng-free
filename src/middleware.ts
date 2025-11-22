import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks",
  "/api/inngest",
  "/sell(.*)",
  "/faq",
  "/terms",
  "/support",
  "/",
  "/(.*)inngest(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request) && !isAdminRoute(request)) {
    auth().protect();
  } else if (
    isAdminRoute(request) &&
    auth().sessionClaims?.metadata?.role !== "admin"
  ) {
    const url = new URL("/sell", request.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// {
//     publicRoutes: [
//       "/sign-in(.*)",
//       "/sign-up(.*)",
//       "/api/webhooks",
//       "/sell(.*)",
//       "/faq",
//       "/terms",
//       "/support",
//     ],
//     ignoredRoutes: [
//       "/((?!_next|.*\\.(?:jpg|png|gif|ico)).*)",
//       "/(api|trpc)(.*)",
//     ],
//     signInUrl: "/sell",
//     signUpUrl: "/sell",
//     afterSignOutUrl: "/sell",
//   }
