'use client'

import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    walletConfigUpdateSchema,
    type WalletConfigUpdate,
    type IWalletConfig,
} from '@workspace/schemas'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Separator } from '@workspace/ui/components/separator'
import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

// ─── Setting Row ──────────────────────────────────────────────────────────────

function SettingRow({
    label,
    description,
    error,
    children,
}: {
    label: string
    description: string
    error?: string
    children: ReactNode
}) {
    return (
        <div className="grid grid-cols-1 items-start gap-3 py-4 md:grid-cols-2 md:gap-8">
            <div className="space-y-0.5">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="space-y-1">
                {children}
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
        </div>
    )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export function WalletConfigForm({ config }: { config: IWalletConfig }) {
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<WalletConfigUpdate>({
        resolver: zodResolver(walletConfigUpdateSchema),
        defaultValues: {
            earnRatePercent: config.earnRatePercent,
            expiryMonths: config.expiryMonths,
            referralBonusReferrer: config.referralBonusReferrer,
            referralBonusReferred: config.referralBonusReferred,
        },
    })

    async function onSubmit(_data: WalletConfigUpdate) {
        // TODO: implement updateWalletConfig action
        toast.success('Configuration saved')
    }

    const updatedAt = new Date(config.updatedAt).toLocaleString()

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-border">
            {/* ── Section: Earn Settings ── */}
            <div className="pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Earn Settings
                </p>
            </div>

            <Controller
                name="earnRatePercent"
                control={control}
                render={({ field, fieldState }) => (
                    <SettingRow
                        label="Earn Rate"
                        description="Decimal fraction of each purchase credited as points (e.g. 0.01 = 1%)"
                        error={fieldState.error?.message}
                    >
                        <Input
                            id={field.name}
                            type="number"
                            step="0.001"
                            min="0"
                            max="1"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isSubmitting}
                            aria-invalid={fieldState.invalid}
                        />
                    </SettingRow>
                )}
            />

            <Controller
                name="expiryMonths"
                control={control}
                render={({ field, fieldState }) => (
                    <SettingRow
                        label="Point Expiry"
                        description="Number of months before earned points expire"
                        error={fieldState.error?.message}
                    >
                        <Input
                            id={field.name}
                            type="number"
                            step="1"
                            min="1"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isSubmitting}
                            aria-invalid={fieldState.invalid}
                        />
                    </SettingRow>
                )}
            />

            {/* ── Section: Referral Bonuses ── */}
            <Separator className="my-0" />
            <div className="pb-1 pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Referral Bonuses
                </p>
            </div>

            <Controller
                name="referralBonusReferrer"
                control={control}
                render={({ field, fieldState }) => (
                    <SettingRow
                        label="Referrer Bonus"
                        description="Points awarded to the customer who shared their referral code"
                        error={fieldState.error?.message}
                    >
                        <Input
                            id={field.name}
                            type="number"
                            step="0.5"
                            min="0"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isSubmitting}
                            aria-invalid={fieldState.invalid}
                        />
                    </SettingRow>
                )}
            />

            <Controller
                name="referralBonusReferred"
                control={control}
                render={({ field, fieldState }) => (
                    <SettingRow
                        label="Referred Bonus"
                        description="Points awarded to the new customer who used a referral code"
                        error={fieldState.error?.message}
                    >
                        <Input
                            id={field.name}
                            type="number"
                            step="0.5"
                            min="0"
                            value={field.value}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            disabled={isSubmitting}
                            aria-invalid={fieldState.invalid}
                        />
                    </SettingRow>
                )}
            />

            {/* ── Footer ── */}
            <div className="flex items-center justify-between pt-6">
                <p className="text-xs text-muted-foreground">Last updated: {updatedAt}</p>
                <Button type="submit" disabled={isSubmitting}>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving…' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
