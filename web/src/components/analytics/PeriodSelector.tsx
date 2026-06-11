'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUrlParams } from "@/hooks/useUrlParams"
import { PERIODS } from "@/lib/analytics"
import { Suspense } from "react"

export function PeriodSelector() {
    return (
        <Suspense fallback={<div className="h-9 w-[180px] rounded-md border bg-muted/40" />}>
            <PeriodSelectorInner />
        </Suspense>
    )
}

function PeriodSelectorInner() {
    const { updateUrlParams, getParam } = useUrlParams()
    const period = getParam('period', '30d')!

    return (
        <Select value={period} onValueChange={(value) => updateUrlParams({ period: value === '30d' ? null : value })}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
                {PERIODS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
