import { getOrdersReport } from "@/actions/queries"
import { DataSection } from "@/components/DataSection"
import { BreakdownDonut } from "@/components/analytics/BreakdownDonut"
import { PeriodSelector } from "@/components/analytics/PeriodSelector"
import { StatCard } from "@/components/analytics/StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatMoney, resolvePeriod } from "@/lib/analytics"
import type { IPageSearchParams } from "@/types"
import { BadgeCheck, Clock3, ShoppingCart, XCircle } from "lucide-react"
import { OrdersOverTimeChart } from "./_components/OrdersOverTimeChart"

const PLACED_BY_LABELS: Record<string, string> = {
    customer: "Customer app",
    agent: "Agent",
    officer: "Officer",
}

const FUNNEL_STEPS = [
    { key: "created", label: "Created" },
    { key: "confirmed", label: "Confirmed" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "completed", label: "Completed" },
] as const

export default function Page({ searchParams }: IPageSearchParams) {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Order Reports</h2>
                    <p className="text-muted-foreground">
                        Order operations, fulfilment funnel, and agent performance.
                    </p>
                </div>
                <PeriodSelector />
            </div>
            <DataSection label="order reports">
                <OrdersReport searchParams={searchParams} />
            </DataSection>
        </div>
    )
}

async function OrdersReport({ searchParams }: IPageSearchParams) {
    const params = await searchParams
    const { from, to, interval } = resolvePeriod(typeof params.period === "string" ? params.period : undefined)
    const { data } = await getOrdersReport({ from, to, interval })

    const { kpis, funnel } = data

    return (
        <div className="flex flex-col gap-6">
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total orders" value={kpis.totalOrders} icon={ShoppingCart} />
                <StatCard title="Completion rate" value={`${kpis.completionRate}%`} hint={`${kpis.completedOrders} completed`} icon={BadgeCheck} />
                <StatCard title="Cancellation rate" value={`${kpis.cancellationRate}%`} hint={`${kpis.cancelledOrders} cancelled`} icon={XCircle} />
                <StatCard
                    title="Avg fulfilment time"
                    value={kpis.avgFulfillmentHours !== null ? `${kpis.avgFulfillmentHours}h` : "—"}
                    hint="Order created → delivered"
                    icon={Clock3}
                />
            </div>

            {/* Orders over time */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders over time</CardTitle>
                    <CardDescription>Stacked by status, bucketed by {interval}</CardDescription>
                </CardHeader>
                <CardContent>
                    {data.statusSeries.length ? (
                        <OrdersOverTimeChart data={data.statusSeries} interval={interval} />
                    ) : (
                        <p className="py-10 text-center text-sm text-muted-foreground">No orders in this period</p>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Funnel */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Fulfilment funnel</CardTitle>
                        <CardDescription>How many orders reached each stage</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        {FUNNEL_STEPS.map((step) => {
                            const count = funnel[step.key] ?? 0
                            const pct = funnel.created ? (count / funnel.created) * 100 : 0
                            return (
                                <div key={step.key} className="flex items-center gap-3 text-sm">
                                    <span className="w-32 shrink-0 text-muted-foreground">{step.label}</span>
                                    <div className="h-6 flex-1 overflow-hidden rounded bg-muted">
                                        <div className="h-full rounded bg-primary/80" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-20 shrink-0 text-right font-medium tabular-nums">
                                        {count}
                                        <span className="ml-1 text-xs text-muted-foreground">({pct.toFixed(0)}%)</span>
                                    </span>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Placed by */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order channel</CardTitle>
                        <CardDescription>Who placed the orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.placedBy.length ? (
                            <BreakdownDonut
                                data={data.placedBy.map((p) => ({ name: PLACED_BY_LABELS[p.placedBy] ?? p.placedBy, value: p.count }))}
                                valueLabel="Orders"
                            />
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">No orders in this period</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Agent performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Agent performance</CardTitle>
                    <CardDescription>Per-agent order handling and revenue for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead className="text-right">Orders</TableHead>
                                <TableHead className="text-right">Delivered</TableHead>
                                <TableHead className="text-right">Completed</TableHead>
                                <TableHead className="text-right">Cancelled</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">Avg delivery</TableHead>
                                <TableHead className="text-right">Customers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.agentPerformance.map((agent) => (
                                <TableRow key={agent.agentId}>
                                    <TableCell className="font-medium">{agent.name}</TableCell>
                                    <TableCell className="text-right tabular-nums">{agent.totalOrders}</TableCell>
                                    <TableCell className="text-right tabular-nums">{agent.delivered}</TableCell>
                                    <TableCell className="text-right tabular-nums">{agent.completed}</TableCell>
                                    <TableCell className="text-right tabular-nums">{agent.cancelled}</TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">{formatMoney(agent.revenue)}</TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        {agent.avgDeliveryHours !== null ? `${agent.avgDeliveryHours}h` : "—"}
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">{agent.assignedCustomers}</TableCell>
                                </TableRow>
                            ))}
                            {!data.agentPerformance.length && (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                                        No orders in this period
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Cancellation reasons */}
            {data.cancelReasons.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Cancellation reasons</CardTitle>
                        <CardDescription>{kpis.cancelledOrders} cancelled orders in this period</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col divide-y">
                        {data.cancelReasons.map((r) => (
                            <div key={r.reason} className="flex items-center justify-between py-2 text-sm">
                                <span className="truncate">{r.reason}</span>
                                <span className="shrink-0 font-medium tabular-nums">{r.count}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
