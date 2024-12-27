import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const isProtectedRoute = createRouteMatcher(['/(.*)'])


export default clerkMiddleware((auth, request) => {
  console.log(request.url, 'request.url')
  const {redirectToSignIn, userId, protect} = auth()
  if (!userId) {
    console.log('protecting')
    // protect()
    return redirectToSignIn()
  } 
})


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};


// export const config = {
//   matcher: ["/((?!.*|\..*|_next).*)", "/", "/(api|trpc)(.*)"]
// }
