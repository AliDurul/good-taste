// ─────────────────────────────────────────────────────────────────────────────
// calculateEarnValue
// Earn = 1% of price by default, rounded to 2 decimal places.
// Always call this server-side — never trust client.

import { prisma } from "../lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
export const calculateEarnValue = (price: number) =>
    parseFloat((price * 0.01).toFixed(2));

// ─────────────────────────────────────────────────────────────────────────────
// getWalletExpiry
// Returns expiry date based on WalletConfig.expiryMonths (default 12).
// ─────────────────────────────────────────────────────────────────────────────
export const getWalletExpiry = async () => {
    const config = await prisma.walletConfig.findUnique({
        where: { key: "global" },
    });
    const months = config?.expiryMonths ?? 12;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);
    return expiry;
};

// ─────────────────────────────────────────────────────────────────────────────
// checkAndUpdateTier
// Called inside a transaction after every purchase.
// Finds the highest tier the customer qualifies for based on totalSpend.
// tx = Prisma transaction client
// ─────────────────────────────────────────────────────────────────────────────
export const checkAndUpdateTier = async (tx: any, customerId: string, totalSpend: number) => {
    const customer = await tx.user.findUnique({
        where: { id: customerId },
        select: { tierId: true },
    });

    // Find highest qualifying tier
    const newTier = await tx.loyaltyTier.findFirst({
        where: {
            minSpend: { lte: totalSpend },
            OR: [
                { maxSpend: null },
                { maxSpend: { gte: totalSpend } },
            ],
        },
        orderBy: { minSpend: "desc" },
    });

    if (!newTier) return null;
    if (newTier.id === customer.tierId) return null; // no change

    const oldTier = customer.tierId
        ? await tx.loyaltyTier.findUnique({ where: { id: customer.tierId } })
        : null;

    const reason = !oldTier
        ? "initial"
        : newTier.minSpend > (oldTier.minSpend ?? 0)
            ? "upgrade"
            : "downgrade";

    // Update user tier
    await tx.user.update({
        where: { id: customerId },
        data: { tierId: newTier.id },
    });

    // Log tier change
    await tx.tierHistory.create({
        data: {
            customerId,
            fromTierId: customer.tierId ?? null,
            toTierId: newTier.id,
            reason,
        },
    });

    return { newTier, reason };
};

// ─────────────────────────────────────────────────────────────────────────────
// findApplicablePromotion
// Finds the best active promotion for the given customer and variants.
// Returns one promotion or null.
// ─────────────────────────────────────────────────────────────────────────────
export const findApplicablePromotion = async (customerId: string, variantIds: string[]) => {
    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        select: { tierId: true },
    });

    const now = new Date();

    const allPromotions = await prisma.promotion.findMany({
        where: {
            isActive: true,
            startsAt: { lte: now },
            endsAt: { gte: now },
        },
        include: {
            targetTiers: true,
            targetCategories: { include: { category: true } },
        },
    });

    // Filter out promotions that have exceeded their usage limit
    const promotions = allPromotions.filter(
        (p) => p.usageLimit === null || p.usageCount < p.usageLimit
    );

    for (const promo of promotions) {
        // Tier check — empty targetTiers means applies to all tiers
        if (promo.targetTiers.length > 0) {
            const tierMatch = promo.targetTiers.some((t) => t.tierId === customer?.tierId);
            if (!tierMatch) continue;
        }

        // For non-bundle promotions return the first match
        if (promo.type !== "bundle") return promo;

        // Bundle: check all required variants are in the order
        const bundleItems = await prisma.promotionBundleItem.findMany({
            where: { promotionId: promo.id },
        });
        const allPresent = bundleItems.every((bi) => variantIds.includes(bi.variantId));
        if (allPresent) return promo;
    }

    return null;
};