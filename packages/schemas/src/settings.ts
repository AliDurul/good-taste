import z from "zod"

// ─── Wallet Config ────────────────────────────────────────────────────────────

export interface IWalletConfig {
    id: string
    key: string
    earnRatePercent: number
    expiryMonths: number
    referralBonusReferrer: number
    referralBonusReferred: number
    updatedAt: string
}

export const walletConfigUpdateSchema = z.object({
    earnRatePercent: z.coerce.number().min(0).max(1),
    expiryMonths: z.coerce.number().int().min(1),
    referralBonusReferrer: z.coerce.number().min(0),
    referralBonusReferred: z.coerce.number().min(0),
})

export type WalletConfigUpdate = z.infer<typeof walletConfigUpdateSchema>

// ─── Loyalty Tier ─────────────────────────────────────────────────────────────

export interface ILoyaltyTier {
    id: string
    name: string
    minSpend: number
    maxSpend: number | null
    earnMultiplier: number
    color: string
    createdAt: string
    updatedAt: string
}

export const loyaltyTierFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    minSpend: z.coerce.number().min(0, "Min spend must be non-negative"),
    maxSpend: z.number().nullable(),
    earnMultiplier: z.coerce.number().min(0, "Earn multiplier must be non-negative"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, "Must be a valid hex color"),
})

export type LoyaltyTierForm = z.infer<typeof loyaltyTierFormSchema>
