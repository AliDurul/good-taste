import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    advanced: {
        cookiePrefix: "goodtaste", // Cookie name: goodtaste.session_token
        useSecureCookies: true, // HTTPS only
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
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
            // Optional: request additional permissions
            scopes: ["email", "public_profile"],
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Refresh expiration every 1 day
        // Optional: Enable cookie caching to reduce DB hits
        cookieCache: {
            enabled: true,
            maxAge: 10 * 60, // 10 minutes
        }
    },
    trustedOrigins: process.env.TRUSTED_ORIGINS?.split(',').map(origin => origin.trim()) || [],
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BASE_URL!,
    basePath: "/api/v1/auth",
});