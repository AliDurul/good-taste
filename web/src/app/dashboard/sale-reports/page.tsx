import { getSalesReport } from "@/actions/queries"
import { DataSection } from "@/components/DataSection"
import { BreakdownDonut } from "@/components/analytics/BreakdownDonut"
import { PeriodSelector } from "@/components/analytics/PeriodSelector"
import { StatCard } from "@/components/analytics/StatCard"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney, resolvePeriod } from "@/lib/analytics"
import type { IPageSearchParams } from "@/types"
import { BadgePercent, DollarSign, Receipt, ShoppingCart, Wallet } from "lucide-react"
import { RevenueTrendChart } from "../_components/RevenueTrendChart"
import { TopProductsChart } from "./_components/TopProductsChart"

const METHOD_LABELS: Record<string, string> = {
    cash: "Cash",
    mobile_money: "Mobile Money",
    bank_transfer: "Bank Transfer",
    wallet: "Wallet",
}

export default function Page({ searchParams }: IPageSearchParams) {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Sale Reports</h2>
                    <p className="text-muted-foreground">
                        Revenue, products, and customer insights for the selected period.
                    </p>
                </div>
                <PeriodSelector />
            </div>
            <DataSection label="sale reports">
                <SalesReport searchParams={searchParams} />
            </DataSection>
        </div>
    )
}

async function SalesReport({ searchParams }: IPageSearchParams) {
    const params = await searchParams
    const { from, to, interval } = resolvePeriod(typeof params.period === "string" ? params.period : undefined)
    const { data } = await getSalesReport({ from, to, interval })

    const { kpis, customerInsights } = data

    return (
        <div className="flex flex-col gap-6">
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard title="Net revenue" value={formatMoney(kpis.netRevenue)} hint={`Gross ${formatMoney(kpis.grossRevenue)}`} icon={DollarSign} />
                <StatCard title="Orders" value={kpis.orders} hint="Delivered & completed" icon={ShoppingCart} />
                <StatCard title="Avg order value" value={formatMoney(kpis.avgOrderValue)} icon={Receipt} />
                <StatCard title="Discounts given" value={formatMoney(kpis.discounts)} icon={BadgePercent} />
                <StatCard title="Wallet points" value={formatMoney(kpis.walletEarned)} hint={`Redeemed ${formatMoney(kpis.walletRedeemed)}`} icon={Wallet} />
            </div>

            {/* Revenue over time */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue over time</CardTitle>
                    <CardDescription>Bucketed by {interval}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RevenueTrendChart data={data.revenueSeries} interval={interval} />
                </CardContent>
            </Card>

            {/* Breakdowns */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by category</CardTitle>
                        <CardDescription>Revenue per product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.categoryBreakdown.length ? (
                            <BreakdownDonut
                                data={data.categoryBreakdown.map((c) => ({ name: c.category, value: c.revenue }))}
                                valueLabel="Revenue"
                                isMoney
                            />
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">No sales in this period</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top products</CardTitle>
                        <CardDescription>By revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.topProducts.length ? (
                            <TopProductsChart data={data.topProducts.slice(0, 6)} />
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">No sales in this period</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment methods</CardTitle>
                        <CardDescription>Revenue per payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data.paymentMethods.length ? (
                            <BreakdownDonut
                                data={data.paymentMethods.map((p) => ({ name: METHOD_LABELS[p.method] ?? p.method, value: p.revenue }))}
                                valueLabel="Revenue"
                                isMoney
                            />
                        ) : (
                            <p className="py-10 text-center text-sm text-muted-foreground">No sales in this period</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Customer insights */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Top customers</CardTitle>
                        <CardDescription>By spend in this period</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col divide-y">
                        {customerInsights.topCustomers.map((c, i) => (
                            <div key={c.customerId} className="flex items-center justify-between gap-3 py-2 text-sm">
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="text-muted-foreground">{i + 1}.</span>
                                    <span className="truncate font-medium">{c.name}</span>
                                    {c.tier && <Badge variant="outline">{c.tier}</Badge>}
                                </span>
                                <span className="shrink-0 text-right">
                                    <span className="font-medium tabular-nums">{formatMoney(c.spend)}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">{c.orders} orders</span>
                                </span>
                            </div>
                        ))}
                        {!customerInsights.topCustomers.length && (
                            <p className="py-6 text-center text-sm text-muted-foreground">No customer purchases in this period</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>New vs returning</CardTitle>
                            <CardDescription>Buying customers in this period</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-around py-2 text-center">
                            <div>
                                <p className="text-2xl font-bold tabular-nums">{customerInsights.newCustomers}</p>
                                <p className="text-xs text-muted-foreground">New</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold tabular-nums">{customerInsights.returningCustomers}</p>
                                <p className="text-xs text-muted-foreground">Returning</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tier distribution</CardTitle>
                            <CardDescription>Buying customers by loyalty tier</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col divide-y">
                            {customerInsights.tierDistribution.map((t) => (
                                <div key={t.tier} className="flex items-center justify-between py-2 text-sm">
                                    <span>{t.tier}</span>
                                    <span className="font-medium tabular-nums">{t.customers}</span>
                                </div>
                            ))}
                            {!customerInsights.tierDistribution.length && (
                                <p className="py-4 text-center text-sm text-muted-foreground">No data</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
