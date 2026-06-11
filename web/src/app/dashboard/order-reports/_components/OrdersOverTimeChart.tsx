'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatBucket } from "@/lib/analytics"
import type { AnalyticsInterval, OrderStatus } from "@/types"

const STATUSES: OrderStatus[] = ["pending", "confirmed", "out_for_delivery", "delivered", "completed", "cancelled"]

const chartConfig = {
    pending: { label: "Pending", color: "var(--chart-1)" },
    confirmed: { label: "Confirmed", color: "var(--chart-2)" },
    out_for_delivery: { label: "Out for Delivery", color: "var(--chart-3)" },
    delivered: { label: "Delivered", color: "var(--chart-4)" },
    completed: { label: "Completed", color: "var(--chart-5)" },
    cancelled: { label: "Cancelled", color: "var(--destructive)" },
} satisfies ChartConfig

export function OrdersOverTimeChart({ data, interval }: {
    data: { date: string; status: OrderStatus; count: number }[]
    interval: AnalyticsInterval
}) {
    // Pivot [{date, status, count}] into one row per bucket with a column per status
    const byDate = new Map<string, Record<string, number | string>>()
    for (const row of data) {
        const key = new Date(row.date).toISOString()
        if (!byDate.has(key)) byDate.set(key, { date: key })
        byDate.get(key)![row.status] = row.count
    }
    const chartData = [...byDate.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)))

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => formatBucket(value, interval)}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
                <ChartTooltip
                    content={<ChartTooltipContent labelFormatter={(_, payload) => formatBucket(String(payload?.[0]?.payload?.date ?? ""), interval)} />}
                />
                <ChartLegend content={<ChartLegendContent />} className="flex-wrap gap-2" />
                {STATUSES.map((status) => (
                    <Bar key={status} dataKey={status} stackId="orders" fill={`var(--color-${status})`} radius={[0, 0, 0, 0]} />
                ))}
            </BarChart>
        </ChartContainer>
    )
}
