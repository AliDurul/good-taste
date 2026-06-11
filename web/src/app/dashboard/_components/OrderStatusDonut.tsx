'use client';

import { Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { OrderStatus } from "@/types"

const chartConfig = {
    count: { label: "Orders" },
    pending: { label: "Pending", color: "var(--chart-1)" },
    confirmed: { label: "Confirmed", color: "var(--chart-2)" },
    out_for_delivery: { label: "Out for Delivery", color: "var(--chart-3)" },
    delivered: { label: "Delivered", color: "var(--chart-4)" },
    completed: { label: "Completed", color: "var(--chart-5)" },
    cancelled: { label: "Cancelled", color: "var(--destructive)" },
} satisfies ChartConfig

export function OrderStatusDonut({ data }: { data: { status: OrderStatus; count: number }[] }) {
    const chartData = data.map((d) => ({ ...d, fill: `var(--color-${d.status})` }))

    return (
        <ChartContainer config={chartConfig} className="mx-auto h-[280px] w-full">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
                <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5} />
                <ChartLegend content={<ChartLegendContent nameKey="status" />} className="flex-wrap gap-2" />
            </PieChart>
        </ChartContainer>
    )
}
