import { RequestHandler } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma";
import { generateReferralCode } from "../lib/utils";

export const signUp: RequestHandler = async (req, res) => {
    const { name, email, password, referredByCode, phone, address, city, country, birthday } = req.validatedBody;

    const result = await auth.api.signUpEmail({
        body: { name, email, password },
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    }) as any;

    const { headers } = result;
    const userId: string | undefined = result.data?.user?.id ?? result.data?.id;

    if (userId) {
        await prisma.$transaction(async (tx) => {
            const bronzeTier = await tx.loyaltyTier.findFirst({ where: { name: "Bronze" } });
            const referralCode = generateReferralCode();

            await tx.user.update({
                where: { id: userId },
                data: {
                    referralCode,
                    ...(bronzeTier && { tierId: bronzeTier.id }),
                    phone,
                    address,
                    city,
                    country,
                    birthday: birthday ? new Date(birthday) : undefined,
                },
            });

            if (bronzeTier) {
                await tx.tierHistory.create({
                    data: { customerId: userId, fromTierId: null, toTierId: bronzeTier.id, reason: "initial" },
                });
            }

            if (referredByCode) {
                const referrer = await tx.user.findUnique({
                    where: { referralCode: referredByCode },
                    select: { id: true, walletBalance: true, role: true, banned: true },
                });

                if (referrer && referrer.role === "customer" && !referrer.banned) {
                    const config = await tx.walletConfig.findUnique({ where: { key: "global" } });
                    const referrerBonus = config?.referralBonusReferrer ?? 5.0;
                    const referredBonus = config?.referralBonusReferred ?? 2.5;

                    // Credit referrer
                    const newReferrerBalance = referrer.walletBalance + referrerBonus;
                    await tx.walletTransaction.create({
                        data: {
                            customerId: referrer.id,
                            type: "bonus_referral",
                            amount: referrerBonus,
                            balance: newReferrerBalance,
                            description: "Referral bonus for referring a new customer",
                        },
                    });
                    await tx.user.update({
                        where: { id: referrer.id },
                        data: { walletBalance: { increment: referrerBonus } },
                    });

                    // Credit new customer
                    await tx.walletTransaction.create({
                        data: {
                            customerId: userId,
                            type: "bonus_referral",
                            amount: referredBonus,
                            balance: referredBonus,
                            description: "Welcome bonus from referral",
                        },
                    });
                    await tx.user.update({
                        where: { id: userId },
                        data: { walletBalance: { increment: referredBonus } },
                    });
                }
            }
        });
    }

    // for development
    const authToken = headers.get("set-auth-token");
    const cookies = headers.getSetCookie();
    cookies.forEach((cookie: string) => res.setHeader("Set-Cookie", cookie));

    res.status(200).send({ success: true, authToken, message: "Sign up successful" });
};

export const signIn: RequestHandler = async (req, res) => {
    const { email, password } = req.validatedBody;
    const { headers } = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    });

    // for development
    const authToken = headers.get("set-auth-token");

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, authToken, message: 'Sign in successful' });
};

export const signOut: RequestHandler = async (req, res) => {
    const { headers } = await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    });

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, message: 'Sign out successful' });
};