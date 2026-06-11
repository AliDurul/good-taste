import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { CustomError } from "../lib/common";
import { Prisma } from "../../generated/prisma/client";
import { OrderWhereInput } from "../../generated/prisma/models";

// Statuses that count as realised revenue
const REVENUE_STATUSES = ["delivered", "completed"] as const;

type Interval = "day" | "week" | "month";

function parseRange(query: Record<string, string | undefined>) {
    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from
        ? new Date(query.from)
        : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        throw new CustomError("Invalid 'from' or 'to' date", 400, true);
    }

    const interval: Interval = ["day", "week", "month"].includes(query.interval ?? "")
        ? (query.interval as Interval)
        : "day";

    return { from, to, interval };
}

const round2 = (n: number | null | undefined) => parseFloat((n ?? 0).toFixed(2));

// Revenue time series bucketed by interval — agentId optional scope
async function revenueSeries(from: Date, to: Date, interval: Interval, agentId?: string) {
    const agentFilter = agentId ? Prisma.sql`AND "agentId" = ${agentId}` : Prisma.empty;
    const rows = await prisma.$queryRaw<{ bucket: Date; revenue: number; orders: number }[]>`
        SELECT date_trunc(${interval}, "createdAt") AS bucket,
               COALESCE(SUM("finalAmount") FILTER (WHERE status::text IN ('delivered', 'completed')), 0)::float AS revenue,
               COUNT(*)::int AS orders
        FROM "order"
        WHERE "createdAt" >= ${from} AND "createdAt" <= ${to}
          AND status::text != 'cancelled'
          ${agentFilter}
        GROUP BY bucket
        ORDER BY bucket ASC
    `;
    return rows.map((r) => ({ date: r.bucket, revenue: round2(r.revenue), orders: r.orders }));
}

// =============================================================================
// GET /analytics/dashboard — main dashboard overview (admin/officer)
// =============================================================================
export const getDashboardStats: RequestHandler = async (req, res) => {
    const user = req.user!;
    if (user.role !== "admin" && user.role !== "officer") {
        throw new CustomError("Forbidden - insufficient permissions", 403, true);
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const revenueWhere = (gte: Date, lt?: Date): OrderWhereInput => ({
        status: { in: [...REVENUE_STATUSES] },
        createdAt: { gte, ...(lt ? { lt } : {}) },
    });

    const [
        currentAgg,
        previousAgg,
        currentNewCustomers,
        previousNewCustomers,
        walletAgg,
        lowStockCount,
        pendingOrders,
        statusGroups,
        recentOrders,
        lowStockProducts,
        topAgentGroups,
        series,
    ] = await Promise.all([
        prisma.order.aggregate({ where: revenueWhere(monthStart), _sum: { finalAmount: true }, _count: true }),
        prisma.order.aggregate({ where: revenueWhere(prevMonthStart, monthStart), _sum: { finalAmount: true }, _count: true }),
        prisma.user.count({ where: { role: "customer", createdAt: { gte: monthStart } } }),
        prisma.user.count({ where: { role: "customer", createdAt: { gte: prevMonthStart, lt: monthStart } } }),
        prisma.user.aggregate({ where: { role: "customer" }, _sum: { walletBalance: true } }),
        prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "product" WHERE "isActive" = true AND "stockQty" <= "lowStockThreshold"`,
        prisma.order.count({ where: { status: "pending" } }),
        prisma.order.groupBy({
            by: ["status"],
            where: { status: { in: ["pending", "confirmed", "out_for_delivery", "delivered"] } },
            _count: true,
        }),
        prisma.order.findMany({
            take: 8,
            orderBy: { createdAt: "desc" },
            select: {
                id: true, status: true, finalAmount: true, createdAt: true,
                customer: { select: { name: true } }, agent: { select: { name: true } },
            },
        }),
        prisma.$queryRaw<{ id: string; name: string; stockQty: number; lowStockThreshold: number }[]>`
            SELECT id, name, "stockQty", "lowStockThreshold" FROM "product"
            WHERE "isActive" = true AND "stockQty" <= "lowStockThreshold"
            ORDER BY "stockQty" ASC LIMIT 8`,
        prisma.order.groupBy({
            by: ["agentId"],
            where: revenueWhere(monthStart),
            _sum: { finalAmount: true },
            _count: true,
            orderBy: { _sum: { finalAmount: "desc" } },
            take: 5,
        }),
        revenueSeries(last30, now, "day"),
    ]);

    const agents = topAgentGroups.length
        ? await prisma.user.findMany({
            where: { id: { in: topAgentGroups.map((g) => g.agentId) } },
            select: { id: true, name: true },
        })
        : [];
    const agentName = new Map(agents.map((a) => [a.id, a.name]));

    const currentRevenue = round2(currentAgg._sum.finalAmount);
    const previousRevenue = round2(previousAgg._sum.finalAmount);

    res.status(200).send({
        success: true,
        data: {
            kpis: {
                revenue: { current: currentRevenue, previous: previousRevenue },
                orders: { current: currentAgg._count, previous: previousAgg._count },
                newCustomers: { current: currentNewCustomers, previous: previousNewCustomers },
                avgOrderValue: {
                    current: currentAgg._count ? round2(currentRevenue / currentAgg._count) : 0,
                    previous: previousAgg._count ? round2(previousRevenue / previousAgg._count) : 0,
                },
            },
            walletLiability: round2(walletAgg._sum.walletBalance),
            lowStockCount: lowStockCount[0]?.count ?? 0,
            pendingOrders,
            revenueSeries: series,
            statusBreakdown: statusGroups.map((g) => ({ status: g.status, count: g._count })),
            recentOrders: recentOrders.map((o) => ({
                id: o.id,
                customerName: o.customer.name,
                agentName: o.agent.name,
                finalAmount: o.finalAmount,
                status: o.status,
                createdAt: o.createdAt,
            })),
            lowStockProducts,
            topAgents: topAgentGroups.map((g) => ({
                agentId: g.agentId,
                name: agentName.get(g.agentId) ?? "Unknown",
                orders: g._count,
                revenue: round2(g._sum.finalAmount),
            })),
        },
    });
};

// =============================================================================
// GET /analytics/sales — sale reports (admin/officer: all, agent: own orders)
// =============================================================================
export const getSalesReport: RequestHandler = async (req, res) => {
    const user = req.user!;
    if (user.role === "customer") {
        throw new CustomError("Forbidden - insufficient permissions", 403, true);
    }

    const { from, to, interval } = parseRange(req.query as Record<string, string | undefined>);
    const agentId = user.role === "agent" ? user.id : undefined;
    const agentFilter = agentId ? Prisma.sql`AND o."agentId" = ${agentId}` : Prisma.empty;

    const revenueWhere: OrderWhereInput = {
        status: { in: [...REVENUE_STATUSES] },
        createdAt: { gte: from, lte: to },
        ...(agentId ? { agentId } : {}),
    };

    const [kpiAgg, series, topProductGroups, paymentGroups, categoryRows, tierRows, topCustomerGroups, newVsReturningRows] = await Promise.all([
        prisma.order.aggregate({
            where: revenueWhere,
            _sum: { totalAmount: true, discountAmount: true, finalAmount: true, walletEarned: true, walletRedeemed: true },
            _count: true,
        }),
        revenueSeries(from, to, interval, agentId),
        prisma.orderItem.groupBy({
            by: ["productId", "productName"],
            where: { order: revenueWhere },
            _sum: { quantity: true, subtotal: true },
            orderBy: { _sum: { subtotal: "desc" } },
            take: 10,
        }),
        prisma.order.groupBy({
            by: ["paymentMethod"],
            where: revenueWhere,
            _count: true,
            _sum: { finalAmount: true },
        }),
        prisma.$queryRaw<{ category: string; revenue: number; quantity: number }[]>`
            SELECT c.name AS category,
                   COALESCE(SUM(oi.subtotal), 0)::float AS revenue,
                   COALESCE(SUM(oi.quantity), 0)::int AS quantity
            FROM "order_item" oi
            JOIN "order" o ON o.id = oi."orderId"
            JOIN "product" p ON p.id = oi."productId"
            JOIN "category" c ON c.id = p."categoryId"
            WHERE o.status::text IN ('delivered', 'completed')
              AND o."createdAt" >= ${from} AND o."createdAt" <= ${to}
              ${agentFilter}
            GROUP BY c.name
            ORDER BY revenue DESC
        `,
        prisma.$queryRaw<{ tier: string; customers: number }[]>`
            SELECT COALESCE(lt.name::text, 'No tier') AS tier,
                   COUNT(DISTINCT o."customerId")::int AS customers
            FROM "order" o
            JOIN "user" u ON u.id = o."customerId"
            LEFT JOIN "loyalty_tier" lt ON lt.id = u."tierId"
            WHERE o.status::text IN ('delivered', 'completed')
              AND o."createdAt" >= ${from} AND o."createdAt" <= ${to}
              ${agentFilter}
            GROUP BY tier
            ORDER BY customers DESC
        `,
        prisma.order.groupBy({
            by: ["customerId"],
            where: revenueWhere,
            _sum: { finalAmount: true },
            _count: true,
            orderBy: { _sum: { finalAmount: "desc" } },
            take: 10,
        }),
        prisma.$queryRaw<{ newcustomers: number; returningcustomers: number }[]>`
            SELECT COUNT(*) FILTER (WHERE first_order >= ${from})::int AS newCustomers,
                   COUNT(*) FILTER (WHERE first_order < ${from})::int AS returningCustomers
            FROM (
                SELECT o."customerId", MIN(o."createdAt") AS first_order
                FROM "order" o
                WHERE o.status::text != 'cancelled' ${agentFilter}
                GROUP BY o."customerId"
                HAVING MAX(o."createdAt") FILTER (WHERE o."createdAt" >= ${from} AND o."createdAt" <= ${to}) IS NOT NULL
            ) firsts
        `,
    ]);

    const customers = topCustomerGroups.length
        ? await prisma.user.findMany({
            where: { id: { in: topCustomerGroups.map((g) => g.customerId) } },
            select: { id: true, name: true, tier: { select: { name: true, color: true } } },
        })
        : [];
    const customerById = new Map(customers.map((c) => [c.id, c]));

    const netRevenue = round2(kpiAgg._sum.finalAmount);

    res.status(200).send({
        success: true,
        data: {
            range: { from, to, interval },
            kpis: {
                grossRevenue: round2(kpiAgg._sum.totalAmount),
                discounts: round2(kpiAgg._sum.discountAmount),
                netRevenue,
                walletEarned: round2(kpiAgg._sum.walletEarned),
                walletRedeemed: round2(kpiAgg._sum.walletRedeemed),
                orders: kpiAgg._count,
                avgOrderValue: kpiAgg._count ? round2(netRevenue / kpiAgg._count) : 0,
            },
            revenueSeries: series,
            categoryBreakdown: categoryRows.map((r) => ({ ...r, revenue: round2(r.revenue) })),
            topProducts: topProductGroups.map((g) => ({
                productId: g.productId,
                name: g.productName,
                quantity: g._sum.quantity ?? 0,
                revenue: round2(g._sum.subtotal),
            })),
            paymentMethods: paymentGroups.map((g) => ({
                method: g.paymentMethod,
                orders: g._count,
                revenue: round2(g._sum.finalAmount),
            })),
            customerInsights: {
                tierDistribution: tierRows,
                topCustomers: topCustomerGroups.map((g) => ({
                    customerId: g.customerId,
                    name: customerById.get(g.customerId)?.name ?? "Unknown",
                    tier: customerById.get(g.customerId)?.tier?.name ?? null,
                    orders: g._count,
                    spend: round2(g._sum.finalAmount),
                })),
                newCustomers: newVsReturningRows[0]?.newcustomers ?? 0,
                returningCustomers: newVsReturningRows[0]?.returningcustomers ?? 0,
            },
        },
    });
};

// =============================================================================
// GET /analytics/orders — order reports & agent performance (admin/officer)
// =============================================================================
export const getOrdersReport: RequestHandler = async (req, res) => {
    const user = req.user!;
    if (user.role !== "admin" && user.role !== "officer") {
        throw new CustomError("Forbidden - insufficient permissions", 403, true);
    }

    const { from, to, interval } = parseRange(req.query as Record<string, string | undefined>);
    const rangeWhere: OrderWhereInput = { createdAt: { gte: from, lte: to } };

    const [totals, statusSeries, funnelRows, placedByGroups, agentRows, assignedCounts, cancelReasonGroups] = await Promise.all([
        prisma.$queryRaw<{ total: number; completed: number; cancelled: number; avgfulfillmenthours: number | null }[]>`
            SELECT COUNT(*)::int AS total,
                   COUNT(*) FILTER (WHERE status::text = 'completed')::int AS completed,
                   COUNT(*) FILTER (WHERE status::text = 'cancelled')::int AS cancelled,
                   AVG(EXTRACT(EPOCH FROM ("deliveredAt" - "createdAt")) / 3600) FILTER (WHERE "deliveredAt" IS NOT NULL)::float AS avgFulfillmentHours
            FROM "order"
            WHERE "createdAt" >= ${from} AND "createdAt" <= ${to}
        `,
        prisma.$queryRaw<{ bucket: Date; status: string; count: number }[]>`
            SELECT date_trunc(${interval}, "createdAt") AS bucket, status::text AS status, COUNT(*)::int AS count
            FROM "order"
            WHERE "createdAt" >= ${from} AND "createdAt" <= ${to}
            GROUP BY bucket, status
            ORDER BY bucket ASC
        `,
        prisma.$queryRaw<{ created: number; confirmed: number; out_for_delivery: number; delivered: number; completed: number }[]>`
            SELECT COUNT(*)::int AS created,
                   COUNT("confirmedAt")::int AS confirmed,
                   COUNT("outForDeliveryAt")::int AS out_for_delivery,
                   COUNT("deliveredAt")::int AS delivered,
                   COUNT("completedAt")::int AS completed
            FROM "order"
            WHERE "createdAt" >= ${from} AND "createdAt" <= ${to}
        `,
        prisma.order.groupBy({ by: ["placedBy"], where: rangeWhere, _count: true }),
        prisma.$queryRaw<{
            agentId: string; name: string; total: number; delivered: number; completed: number;
            cancelled: number; revenue: number; avgdeliveryhours: number | null;
        }[]>`
            SELECT o."agentId", u.name,
                   COUNT(*)::int AS total,
                   COUNT(*) FILTER (WHERE o.status::text = 'delivered')::int AS delivered,
                   COUNT(*) FILTER (WHERE o.status::text = 'completed')::int AS completed,
                   COUNT(*) FILTER (WHERE o.status::text = 'cancelled')::int AS cancelled,
                   COALESCE(SUM(o."finalAmount") FILTER (WHERE o.status::text IN ('delivered', 'completed')), 0)::float AS revenue,
                   AVG(EXTRACT(EPOCH FROM (o."deliveredAt" - o."createdAt")) / 3600) FILTER (WHERE o."deliveredAt" IS NOT NULL)::float AS avgDeliveryHours
            FROM "order" o
            JOIN "user" u ON u.id = o."agentId"
            WHERE o."createdAt" >= ${from} AND o."createdAt" <= ${to}
            GROUP BY o."agentId", u.name
            ORDER BY revenue DESC
        `,
        prisma.user.groupBy({ by: ["assignedAgentId"], where: { assignedAgentId: { not: null } }, _count: true }),
        prisma.order.groupBy({
            by: ["cancelReason"],
            where: { ...rangeWhere, status: "cancelled" },
            _count: true,
            orderBy: { _count: { cancelReason: "desc" } },
        }),
    ]);

    const totalRow = totals[0] ?? { total: 0, completed: 0, cancelled: 0, avgfulfillmenthours: null };
    const assignedByAgent = new Map(assignedCounts.map((g) => [g.assignedAgentId, g._count]));

    res.status(200).send({
        success: true,
        data: {
            range: { from, to, interval },
            kpis: {
                totalOrders: totalRow.total,
                completedOrders: totalRow.completed,
                cancelledOrders: totalRow.cancelled,
                completionRate: totalRow.total ? round2((totalRow.completed / totalRow.total) * 100) : 0,
                cancellationRate: totalRow.total ? round2((totalRow.cancelled / totalRow.total) * 100) : 0,
                avgFulfillmentHours: totalRow.avgfulfillmenthours !== null ? round2(totalRow.avgfulfillmenthours) : null,
            },
            statusSeries: statusSeries.map((r) => ({ date: r.bucket, status: r.status, count: r.count })),
            funnel: funnelRows[0] ?? { created: 0, confirmed: 0, out_for_delivery: 0, delivered: 0, completed: 0 },
            placedBy: placedByGroups.map((g) => ({ placedBy: g.placedBy, count: g._count })),
            agentPerformance: agentRows.map((r) => ({
                agentId: r.agentId,
                name: r.name,
                totalOrders: r.total,
                delivered: r.delivered,
                completed: r.completed,
                cancelled: r.cancelled,
                revenue: round2(r.revenue),
                avgDeliveryHours: r.avgdeliveryhours !== null ? round2(r.avgdeliveryhours) : null,
                assignedCustomers: assignedByAgent.get(r.agentId) ?? 0,
            })),
            cancelReasons: cancelReasonGroups.map((g) => ({ reason: g.cancelReason ?? "Unspecified", count: g._count })),
        },
    });
};
