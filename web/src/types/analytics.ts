import type { OrderPlacedBy, OrderStatus, PaymentMethod } from "./order"

export type AnalyticsInterval = "day" | "week" | "month"

export interface KpiComparison {
    current: number
    previous: number
}

export interface RevenuePoint {
    date: string
    revenue: number
    orders: number
}

export interface IDashboardStats {
    kpis: {
        revenue: KpiComparison
        orders: KpiComparison
        newCustomers: KpiComparison
        avgOrderValue: KpiComparison
    }
    walletLiability: number
    lowStockCount: number
    pendingOrders: number
    revenueSeries: RevenuePoint[]
    statusBreakdown: { status: OrderStatus; count: number }[]
    recentOrders: {
        id: string
        customerName: string
        agentName: string
        finalAmount: number
        status: OrderStatus
        createdAt: string
    }[]
    lowStockProducts: { id: string; name: string; stockQty: number; lowStockThreshold: number }[]
    topAgents: { agentId: string; name: string; orders: number; revenue: number }[]
}

export interface ISalesReport {
    range: { from: string; to: string; interval: AnalyticsInterval }
    kpis: {
        grossRevenue: number
        discounts: number
        netRevenue: number
        walletEarned: number
        walletRedeemed: number
        orders: number
        avgOrderValue: number
    }
    revenueSeries: RevenuePoint[]
    categoryBreakdown: { category: string; revenue: number; quantity: number }[]
    topProducts: { productId: string; name: string; quantity: number; revenue: number }[]
    paymentMethods: { method: PaymentMethod; orders: number; revenue: number }[]
    customerInsights: {
        tierDistribution: { tier: string; customers: number }[]
        topCustomers: { customerId: string; name: string; tier: string | null; orders: number; spend: number }[]
        newCustomers: number
        returningCustomers: number
    }
}

export interface IOrdersReport {
    range: { from: string; to: string; interval: AnalyticsInterval }
    kpis: {
        totalOrders: number
        completedOrders: number
        cancelledOrders: number
        completionRate: number
        cancellationRate: number
        avgFulfillmentHours: number | null
    }
    statusSeries: { date: string; status: OrderStatus; count: number }[]
    funnel: { created: number; confirmed: number; out_for_delivery: number; delivered: number; completed: number }
    placedBy: { placedBy: OrderPlacedBy; count: number }[]
    agentPerformance: {
        agentId: string
        name: string
        totalOrders: number
        delivered: number
        completed: number
        cancelled: number
        revenue: number
        avgDeliveryHours: number | null
        assignedCustomers: number
    }[]
    cancelReasons: { reason: string; count: number }[]
}
