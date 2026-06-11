'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCompactMoney, formatMoney } from "@/lib/analytics"

const chartConfig = {
    revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig

export function TopProductsChart({ data }: { data: { name: string; revenue: number; quantity: number }[] }) {
    return (
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => formatCompactMoney(value)} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={110} tickMargin={4} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => (
                                <div className="flex w-full items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{formatMoney(Number(value))}</span>
                                    <span className="text-foreground font-mono tabular-nums">{Number(item.payload?.quantity ?? 0)} sold</span>
                                </div>
                            )}
                        />
                    }
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
