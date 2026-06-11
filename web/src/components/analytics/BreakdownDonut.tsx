'use client';

import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatMoney } from "@/lib/analytics"

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item"

// Generic donut for dynamic labels (categories, payment methods, placedBy…)
export function BreakdownDonut({ data, valueLabel, isMoney = false }: {
    data: { name: string; value: number }[]
    valueLabel: string
    isMoney?: boolean
}) {
    const chartConfig: ChartConfig = { value: { label: valueLabel } }
    const chartData = data.map((d, i) => {
        const key = slug(d.name)
        chartConfig[key] = { label: d.name, color: PALETTE[i % PALETTE.length] }
        return { key, value: d.value, fill: `var(--color-${key})` }
    })

    return (
        <ChartContainer config={chartConfig} className="mx-auto h-[280px] w-full">
            <PieChart>
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            nameKey="key"
                            hideLabel
                            formatter={isMoney ? (value, name, item) => (
                                <div className="flex w-full items-center justify-between gap-4">
                                    <span className="text-muted-foreground">{chartConfig[item.payload?.key as string]?.label ?? name}</span>
                                    <span className="text-foreground font-mono font-medium tabular-nums">{formatMoney(Number(value))}</span>
                                </div>
                            ) : undefined}
                        />
                    }
                />
                <Pie data={chartData} dataKey="value" nameKey="key" innerRadius={60} strokeWidth={5} />
                <ChartLegend content={<ChartLegendContent nameKey="key" />} className="flex-wrap gap-2" />
            </PieChart>
        </ChartContainer>
    )
}
