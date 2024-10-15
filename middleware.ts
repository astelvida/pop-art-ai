import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isProtectedRoute = createRouteMatcher(["/"]);
export default clerkMiddleware(async (auth, req) => {

  const { userId, redirectToSignIn } = auth()
  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: "/" });
  }

  // if useer is logged in and the route is protected, let them through   
  if (userId && isProtectedRoute(req)) {
    return NextResponse.next();
  }
});

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };


export const config = {
  matcher: ["/((?!.*|\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
