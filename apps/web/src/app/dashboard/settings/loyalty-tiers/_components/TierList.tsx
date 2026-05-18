'use client'

import { useState } from 'react'
import type { ILoyaltyTier } from '@workspace/schemas'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { DeleteDialog } from '@/components/DeleteDialog'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { TierFormDialog } from './TierFormDialog'

function formatSpendRange(minSpend: number, maxSpend: number | null): string {
    const min = `$${minSpend.toLocaleString()}`
    if (maxSpend === null) return `${min} and above`
    return `${min} – $${maxSpend.toLocaleString()}`
}

export function TierList({ initialTiers }: { initialTiers: ILoyaltyTier[] }) {
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null)
    const [selectedTier, setSelectedTier] = useState<ILoyaltyTier | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<ILoyaltyTier | null>(null)

    function handleEdit(tier: ILoyaltyTier) {
        setSelectedTier(tier)
        setDialogMode('edit')
    }

    function handleDeleteClick(tier: ILoyaltyTier) {
        setDeleteTarget(tier)
    }

    function handleDialogOpenChange(open: boolean) {
        if (!open) {
            setDialogMode(null)
            setSelectedTier(null)
        }
    }

    async function handleDeleteConfirm() {
        // TODO: implement deleteLoyaltyTier action
        return { success: true, message: `"${deleteTarget?.name}" deleted` }
    }

    return (
        <div className="space-y-6">
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                    {initialTiers.length} tier{initialTiers.length !== 1 ? 's' : ''}
                </span>
                <Button
                    size="sm"
                    onClick={() => {
                        setSelectedTier(null)
                        setDialogMode('create')
                    }}
                >
                    <PlusIcon className="mr-1.5 h-4 w-4" />
                    Add Tier
                </Button>
            </div>

            {/* ── Empty state ── */}
            {initialTiers.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed">
                    <p className="text-sm text-muted-foreground">
                        No loyalty tiers configured yet.
                    </p>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSelectedTier(null)
                            setDialogMode('create')
                        }}
                    >
                        <PlusIcon className="mr-1.5 h-4 w-4" />
                        Add your first tier
                    </Button>
                </div>
            ) : (
                /* ── Tier cards grid ── */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {initialTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10"
                        >
                            {/* Color stripe */}
                            <div className="h-1.5 flex-shrink-0" style={{ background: tier.color }} />

                            {/* Body */}
                            <div className="flex flex-1 flex-col gap-4 p-5">
                                {/* Title row */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <div
                                            className="h-3.5 w-3.5 flex-shrink-0 rounded-full ring-1 ring-black/10"
                                            style={{ background: tier.color }}
                                        />
                                        <span className="truncate text-base font-semibold">
                                            {tier.name}
                                        </span>
                                    </div>
                                    <Badge variant="secondary" className="flex-shrink-0 tabular-nums">
                                        {tier.earnMultiplier}× pts
                                    </Badge>
                                </div>

                                {/* Spend range */}
                                <div className="space-y-0.5">
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Spend Range
                                    </p>
                                    <p className="text-sm">
                                        {formatSpendRange(tier.minSpend, tier.maxSpend)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex items-center gap-1 border-t border-border pt-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleEdit(tier)}
                                    >
                                        <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteClick(tier)}
                                    >
                                        <Trash2Icon className="mr-1.5 h-3.5 w-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Dialogs ── */}
            <TierFormDialog
                open={dialogMode !== null}
                onOpenChange={handleDialogOpenChange}
                tier={dialogMode === 'edit' ? selectedTier : null}
            />

            <DeleteDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null)
                }}
                onConfirm={handleDeleteConfirm}
                title={`Delete "${deleteTarget?.name}"?`}
                description={`This will permanently delete the "${deleteTarget?.name}" tier. This action cannot be undone.`}
            />
        </div>
    )
}
