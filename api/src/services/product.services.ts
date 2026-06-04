// ─────────────────────────────────────────────────────────────────────────────
// calculateEarnValue
// Earn rate comes from walletConfig.earnRatePercent, rounded to 2 decimal places.
// Always call this server-side — never trust client.

import { prisma } from "../lib/prisma";

// ─────────────────────────────────────────────────────────────────────────────
export const calculateEarnValue = async (price: number) => {
    const config = await prisma.walletConfig.findUnique({
        where: { key: "global" },
        select: { earnRatePercent: true },
    });

    const earnRatePercent = config?.earnRatePercent ?? 0.01;

    return parseFloat((price * earnRatePercent).toFixed(2));
};
