// auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin, openAPI } from "better-auth/plugins";
import { expo } from "@better-auth/expo"; 
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        expo(), 
        bearer(), // dev-only, remove in production
        admin({
            adminRoles: ["admin"],
            defaultRole: "customer",
        })
    ],
    advanced: {
        cookiePrefix: "goodtaste",
        // useSecureCookies: process.env.NODE_ENV === "production",
        useSecureCookies: true,
        defaultCookieAttributes: {
            sameSite: "lax",
            // secure: process.env.NODE_ENV === "production",
            secure: true,
            path: "/",
            httpOnly: true,
        }
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            clientId: [
                process.env.GOOGLE_WEB_CLIENT_ID as string,
                process.env.GOOGLE_IOS_CLIENT_ID as string,
                process.env.GOOGLE_ANDROID_CLIENT_ID as string,
            ],
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            scopes: ["email", "public_profile"],
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 10 * 60,
        }
    },
    trustedOrigins: [
        process.env.WEB_FRONTEND_URL!, // e.g., "https://myapp.com"
        "myapp://", // ⬅️ Your mobile app deep link scheme
        ...(process.env.NODE_ENV === "development" ? [
            "exp://", // Expo dev client
            "exp://**",
        ] : []),
    ],
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BASE_URL!,
    basePath: "/api/v1/auth",
});

