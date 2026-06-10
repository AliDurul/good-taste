// auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin as adminPlugin, openAPI } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { bearer } from "better-auth/plugins";
import { ac, admin, agent, customer, officer } from "./permissions";
import { generateReferralCode } from "./utils";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    user: {
        additionalFields: {
            phone: { type: "string", input: true, required: false, },
            address: { type: "string", input: true, required: false, },
            city: { type: "string", input: true, required: false, },
            country: { type: "string", input: true, required: false, },
            birthday: { type: "date", input: true, required: false, },
            referralCode: { type: "string", input: false, required: false, },
            walletBalance: { type: "number", input: false, required: false, },
            totalSpend: { type: "number", input: false, required: false, },
            assignedAgentId: { type: "string", input: true, required: false, },
            referredById: { type: "string", input: true, required: false, },
            tierId: { type: "string", input: false, required: false, },
            role: { type: "string", input: false, required: false },
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    if (user.role !== "customer") return;

                    try {
                        // Use Prisma transaction
                        await prisma.$transaction(async (tx) => {
                            const bronzeTier = await tx.loyaltyTier.findFirst({
                                where: { name: "Bronze" }
                            });

                            const referralCode = generateReferralCode();
                            // Update user with referral code and tier
                            await tx.user.update({
                                where: { id: user.id },
                                data: {
                                    referralCode,
                                    tierId: bronzeTier?.id
                                },
                            });
                            // Create tier history entry
                            await tx.tierHistory.create({
                                data: {
                                    customerId: user.id,
                                    fromTierId: null,
                                    toTierId: bronzeTier?.id,
                                    reason: "initial"
                                },
                            });
                        });
                    } catch (error) {
                        console.error("Failed to set up customer:", error);
                    }
                }
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        expo(), // Required for Expo support
        bearer(), // dev-only, remove in production
        openAPI(),
        adminPlugin({
            ac, // custom access controller
            roles: {
                admin, // full permissions
                agent, // can create users
                officer, // regular users
                customer
            },
            adminRoles: ["admin"],
            defaultRole: "customer",
        })
    ],
    advanced: {
        database: {
            generateId: 'uuid',
        },
        cookiePrefix: "goodtaste",
        useSecureCookies: true,
        defaultCookieAttributes: {
            sameSite: "lax",
            secure: true,
            path: "/",
            httpOnly: true,
        }
    },
    // socialProviders: {
    //     google: {
    //         prompt: "select_account consent",
    //         clientId: [
    //             process.env.GOOGLE_WEB_CLIENT_ID as string,
    //             process.env.GOOGLE_IOS_CLIENT_ID as string,
    //             process.env.GOOGLE_ANDROID_CLIENT_ID as string,
    //         ],
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    //         accessType: "offline",
    //     },
    //     facebook: {
    //         clientId: process.env.FACEBOOK_CLIENT_ID!,
    //         clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    //         scopes: ["email", "public_profile"],
    //     },
    // },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: { enabled: true, maxAge: 10 * 60 }
    },
    trustedOrigins: [
        process.env.WEB_FRONTEND_URL!,
        "http://10.0.2.2:8000", // For Android emulator accessing backend

        ...(process.env.NODE_ENV === "development" ? [
            "exp://**", // Expo dev client
            "exp://192.168.*.*:*/**", // Local network
        ] : [
            "myapp://*",
            "https://your-web-domain.com", // If web version exists
        ])
    ],
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BASE_URL!,
    basePath: "/api/v1/auth",
});

