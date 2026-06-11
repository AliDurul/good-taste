import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"
import type { ReactNode } from "react"

interface StatCardProps {
    title: string
    value: ReactNode
    // When provided, renders a period-over-period delta badge
    current?: number
    previous?: number
    hint?: string
    icon?: React.ElementType
    className?: string
}

export function StatCard({ title, value, current, previous, hint, icon: Icon, className }: StatCardProps) {
    const hasDelta = current !== undefined && previous !== undefined
    const delta = hasDelta && previous! > 0 ? ((current! - previous!) / previous!) * 100 : null
    const up = (delta ?? 0) >= 0

    return (
        <Card className={cn("gap-2", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {Icon && <Icon className="size-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tabular-nums">{value}</div>
                {hasDelta && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {delta !== null ? (
                            <>
                                <span className={cn("flex items-center gap-0.5 font-medium", up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                    {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                    {Math.abs(delta).toFixed(1)}%
                                </span>
                                vs previous period
                            </>
                        ) : (
                            <span>No data for previous period</span>
                        )}
                    </p>
                )}
                {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
            </CardContent>
        </Card>
    )
}
