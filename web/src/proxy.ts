import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, authRoutes, DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    // Check if session cookie exists (does NOT validate it!)
    const sessionCookie = getSessionCookie(request, {
        cookiePrefix: "goodtaste"
    });


    // 2. Auth Guard: Redirect logged-in users away from /login
    if (sessionCookie && isAuthRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
    }

    // 3. Protected Route Guard: Redirect logged-out users to /login
    if (!sessionCookie && !isPublicRoute && !isAuthRoute) {

        const hasErrorParams = searchParams.has("error");
        if (hasErrorParams) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const loginUrl = new URL("/login", request.url);


        return NextResponse.redirect(loginUrl);

    }

    return NextResponse.next();;
}

export const config = {
    matcher: [
        // Exclude /api/uploadthing: UploadThing's CDN makes server-to-server webhook
        // callbacks to this route without user cookies, so it must bypass the auth guard.
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)(?!api/v1/auth)(?!api/uploadthing).*)",
    ],
};