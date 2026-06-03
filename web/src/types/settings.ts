export interface IWalletConfig {
    id: string
    key: string
    earnRatePercent: number
    expiryMonths: number
    referralBonusReferrer: number
    referralBonusReferred: number
    updatedAt: string
}

export interface ILoyaltyTier {
    id: string
    name: string
    minSpend: number
    maxSpend: number | null
    earnMultiplier: number
    color: string
    benefits: string[]
    createdAt: string
    updatedAt: string
}