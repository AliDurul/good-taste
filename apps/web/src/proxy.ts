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

    // console.log("Session cookie:", sessionCookie);

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

        // Only show "session_expired" if cookie exists but session is null
        // (user WAS logged in but session was invalidated)
        // if (sessionCookie && sessionCookie.value) {
        //     loginUrl.searchParams.set("error", "session_expired");
        // }
        return NextResponse.redirect(loginUrl);

    }

    return NextResponse.next();;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$)(?!api/auth).*)",
    ],
};