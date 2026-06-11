import type { AnalyticsInterval } from "@/types"

export const PERIODS = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "12m", label: "Last 12 months" },
] as const

export type Period = (typeof PERIODS)[number]["value"]

const PERIOD_CONFIG: Record<Period, { days: number; interval: AnalyticsInterval }> = {
    "7d": { days: 7, interval: "day" },
    "30d": { days: 30, interval: "day" },
    "90d": { days: 90, interval: "week" },
    "12m": { days: 365, interval: "month" },
}

export function resolvePeriod(period?: string) {
    const key: Period = period && period in PERIOD_CONFIG ? (period as Period) : "30d"
    const { days, interval } = PERIOD_CONFIG[key]
    const to = new Date()
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
    return { period: key, from: from.toISOString(), to: to.toISOString(), interval }
}

export function formatMoney(amount: number) {
    return `K${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatCompactMoney(amount: number) {
    return `K${amount.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 })}`
}

// Tick/label formatter for a time-series bucket date
export function formatBucket(date: string, interval: AnalyticsInterval) {
    const d = new Date(date)
    if (interval === "month") return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}
