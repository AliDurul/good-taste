import { CustomError } from "../lib/common";
import { prisma } from "../lib/prisma";

// ---------------------------------------------------------------------------
// Helper: apply a promotion to totals
// ---------------------------------------------------------------------------
export function applyPromotion(
    promotion: Awaited<ReturnType<typeof findApplicablePromotion>>,
    totalAmount: number
) {
    let discountAmount = 0;
    let isFreeDelivery = false;
    let earnMultiplier = 1;

    if (!promotion) return { discountAmount, isFreeDelivery, earnMultiplier };

    const val = promotion.discountValue ?? 0;
    switch (promotion.type) {
        case "percentage_discount":
        case "bundle":
            discountAmount = parseFloat(((totalAmount * val) / 100).toFixed(2)); break;
        case "fixed_discount":
            discountAmount = Math.min(val, totalAmount); break;
        case "free_delivery":
            isFreeDelivery = true; break;
        case "double_points":
            earnMultiplier = val || 2; break;
    }

    return { discountAmount, isFreeDelivery, earnMultiplier };
}


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
// Finds the best active promotion for the given customer and products.
// Returns one promotion or null.
// ─────────────────────────────────────────────────────────────────────────────
export const findApplicablePromotion = async (customerId: string, productIds: string[]) => {
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

        // Bundle: check all required products are in the order
        const bundleItems = await prisma.promotionBundleItem.findMany({
            where: { promotionId: promo.id },
        });
        const allPresent = bundleItems.every((bi) => productIds.includes(bi.productId));
        if (allPresent) return promo;
    }

    return null;
};

// ---------------------------------------------------------------------------
// Helper: fetch + validate products, enforce stock
// ---------------------------------------------------------------------------
export async function buildLineItems(items: { productId: string; quantity: number }[]) {
    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        include: { category: { select: { id: true, name: true } } },
    });

    const errors: string[] = [];
    for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) { errors.push(`Product ${item.productId} not found or inactive`); continue; }
        if (product.stockQty <= 0) {
            errors.push(`${product.name} is out of stock`);
        } else if (item.quantity > product.stockQty) {
            errors.push(`${product.name} only has ${product.stockQty} in stock`);
        }
    }
    if (errors.length > 0) throw new CustomError(errors.join("; "), 400, true);

    return { products, productIds };
}