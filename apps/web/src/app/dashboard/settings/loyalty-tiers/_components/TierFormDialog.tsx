'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    loyaltyTierFormSchema,
    type LoyaltyTierForm,
    type ILoyaltyTier,
} from '@workspace/schemas'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { toast } from 'sonner'
import { createLoyaltyTier, updateLoyaltyTier } from '@/actions/mutations'
import { PlusIcon, XIcon } from 'lucide-react'

const DEFAULT_VALUES: LoyaltyTierForm = {
    name: '',
    minSpend: 0,
    maxSpend: null,
    earnMultiplier: 1,
    color: '#6366f1',
    benefits: [],
}

interface TierFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tier?: ILoyaltyTier | null
}

export function TierFormDialog({ open, onOpenChange, tier }: TierFormDialogProps) {
    const isEditing = Boolean(tier)

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<LoyaltyTierForm>({
        resolver: zodResolver(loyaltyTierFormSchema),
        defaultValues: DEFAULT_VALUES,
    })

    useEffect(() => {
        if (open) {
            reset(
                tier
                    ? {
                        name: tier.name,
                        minSpend: tier.minSpend,
                        maxSpend: tier.maxSpend,
                        earnMultiplier: tier.earnMultiplier,
                        color: tier.color,
                        benefits: tier.benefits ?? [],
                    }
                    : DEFAULT_VALUES,
            )
        }
    }, [open, tier, reset])

    async function onSubmit(data: LoyaltyTierForm) {
        const result = isEditing && tier
            ? await updateLoyaltyTier(tier.id, data)
            : await createLoyaltyTier(data)
        if (result.success) {
            toast.success(result.message)
            onOpenChange(false)
        } else {
            toast.error(result.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tier-name">Name</Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            id="tier-name"
                                            placeholder="e.g. Gold"
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Color */}
                        <div className="flex flex-col gap-1.5">
                            <Label>Color</Label>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder="#000000"
                                                maxLength={7}
                                                className="font-mono uppercase flex-1"
                                                aria-invalid={fieldState.invalid}
                                                disabled={isSubmitting}
                                            />
                                            <input
                                                type="color"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                disabled={isSubmitting}
                                                className="h-9 w-11 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
                                            />

                                        </div>
                                        {fieldState.error && (
                                            <p className="text-xs text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Spend Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tier-min-spend">Min Spend ($)</Label>
                            <Controller
                                name="minSpend"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            id="tier-min-spend"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={field.value}
                                            onChange={(e) =>
                                                field.onChange(parseFloat(e.target.value) || 0)
                                            }
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tier-max-spend">Max Spend ($)</Label>
                            <Controller
                                name="maxSpend"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            id="tier-max-spend"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={field.value === null ? '' : field.value}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? null
                                                        : parseFloat(e.target.value),
                                                )
                                            }
                                            placeholder="No limit"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                        />
                                        {fieldState.error && (
                                            <p className="text-xs text-destructive">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Earn Multiplier */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tier-multiplier">Earn Multiplier</Label>
                        <Controller
                            name="earnMultiplier"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Input
                                        id="tier-multiplier"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={field.value}
                                        onChange={(e) =>
                                            field.onChange(parseFloat(e.target.value) || 0)
                                        }
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                        <p className="text-xs text-muted-foreground">
                            e.g. 1.5 = 1.5× the base earn rate
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Benefits</Label>
                        <Controller
                            name="benefits"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-2">
                                    {field.value.map((benefit: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={benefit}
                                                onChange={(e) => {
                                                    const next = [...field.value]
                                                    next[index] = e.target.value
                                                    field.onChange(next)
                                                }}
                                                placeholder="e.g. Earn 1% back on all purchases"
                                                disabled={isSubmitting}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    field.onChange(
                                                        field.value.filter((_: string, i: number) => i !== index),
                                                    )
                                                }
                                                disabled={isSubmitting}
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => field.onChange([...field.value, ''])}
                                        disabled={isSubmitting}
                                        className="w-fit"
                                    >
                                        <PlusIcon className="mr-1.5 h-4 w-4" />
                                        Add Benefit
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving…'
                                : isEditing
                                    ? 'Save Changes'
                                    : 'Create Tier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
