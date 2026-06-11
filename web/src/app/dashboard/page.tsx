import { getDashboardStats } from "@/actions/queries"
import { DataSection } from "@/components/DataSection"
import { StatCard } from "@/components/analytics/StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney } from "@/lib/analytics"
import { AlertTriangle, Clock, ShoppingCart, UserPlus, Wallet, DollarSign, Receipt } from "lucide-react"
import Link from "next/link"
import { OrderStatusBadge } from "./orders/_components/OrderBadges"
import { RevenueTrendChart } from "./_components/RevenueTrendChart"
import { OrderStatusDonut } from "./_components/OrderStatusDonut"

export default function Page() {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Business overview — this month&apos;s performance at a glance.
                </p>
            </div>
            <DataSection label="dashboard">
                <DashboardStats />
            </DataSection>
        </div>
    )
}

async function DashboardStats() {
    const { data } = await getDashboardStats()

    return (
        <div className="flex flex-col gap-6">
            {/* Month-over-month KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Revenue (this month)" value={formatMoney(data.kpis.revenue.current)} current={data.kpis.revenue.current} previous={data.kpis.revenue.previous} icon={DollarSign} />
                <StatCard title="Orders (this month)" value={data.kpis.orders.current} current={data.kpis.orders.current} previous={data.kpis.orders.previous} icon={ShoppingCart} />
                <StatCard title="New customers" value={data.kpis.newCustomers.current} current={data.kpis.newCustomers.current} previous={data.kpis.newCustomers.previous} icon={UserPlus} />
                <StatCard title="Avg order value" value={formatMoney(data.kpis.avgOrderValue.current)} current={data.kpis.avgOrderValue.current} previous={data.kpis.avgOrderValue.previous} icon={Receipt} />
            </div>

            {/* Operational stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard title="Pending orders" value={data.pendingOrders} hint="Awaiting confirmation" icon={Clock} />
                <StatCard title="Wallet liability" value={formatMoney(data.walletLiability)} hint="Outstanding customer wallet balance" icon={Wallet} />
                <StatCard title="Low-stock products" value={data.lowStockCount} hint="At or below their restock threshold" icon={AlertTriangle} />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Revenue — last 30 days</CardTitle>
                        <CardDescription>Daily revenue from delivered & completed orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RevenueTrendChart data={data.revenueSeries} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Open orders by status</CardTitle>
                        <CardDescription>Orders currently in the pipeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.statusBreakdown.length ? (
                            <OrderStatusDonut data={data.statusBreakdown} />
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">No open orders</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Lists */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent orders</CardTitle>
                        <CardDescription>Latest 8 orders across all channels</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col divide-y">
                        {data.recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/dashboard/orders/${order.id}`}
                                className="flex items-center justify-between gap-3 py-2.5 text-sm transition-colors hover:bg-muted/50"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{order.customerName}</p>
                                    <p className="truncate text-xs text-muted-foreground">Agent: {order.agentName}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    <span className="font-medium tabular-nums">{formatMoney(order.finalAmount)}</span>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                            </Link>
                        ))}
                        {!data.recentOrders.length && (
                            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top agents (this month)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y">
                            {data.topAgents.map((agent, i) => (
                                <div key={agent.agentId} className="flex items-center justify-between gap-2 py-2 text-sm">
                                    <span className="truncate">
                                        <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                                        {agent.name}
                                    </span>
                                    <span className="shrink-0 text-right">
                                        <span className="font-medium tabular-nums">{formatMoney(agent.revenue)}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">{agent.orders} orders</span>
                                    </span>
                                </div>
                            ))}
                            {!data.topAgents.length && (
                                <p className="py-4 text-center text-sm text-muted-foreground">No agent sales this month</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Low stock</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y">
                            {data.lowStockProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                                    <span className="truncate">{product.name}</span>
                                    <span className="shrink-0 font-medium tabular-nums text-amber-600 dark:text-amber-400">
                                        {product.stockQty} / {product.lowStockThreshold}
                                    </span>
                                </div>
                            ))}
                            {!data.lowStockProducts.length && (
                                <p className="py-4 text-center text-sm text-muted-foreground">All products well stocked</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
