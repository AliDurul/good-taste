'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatBucket, formatCompactMoney, formatMoney } from "@/lib/analytics"
import type { AnalyticsInterval, RevenuePoint } from "@/types"

const chartConfig = {
    revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RevenueTrendChart({ data, interval = "day" }: { data: RevenuePoint[]; interval?: AnalyticsInterval }) {
    return (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => formatBucket(value, interval)}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={60}
                    tickFormatter={(value) => formatCompactMoney(value)}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_, payload) => formatBucket(String(payload?.[0]?.payload?.date ?? ""), interval)}
                            formatter={(value) => formatMoney(Number(value))}
                        />
                    }
                />
                <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="url(#fillRevenue)"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                />
            </AreaChart>
        </ChartContainer>
    )
}
