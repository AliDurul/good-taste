'use client'

import { useEffect, useTransition } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { variantCreateSchema, type VariantCreate, } from '@/schemas'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { toast } from 'sonner'
import { createVariant, updateVariant } from '@/actions/mutations'
import { IProductVariant } from '@/types'

interface VariantFormSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Pre-fill productId when creating a new variant from a product group */
    productId?: string
    /** Pass existing variant to switch form into edit mode */
    variant?: IProductVariant
}

export function VariantFormSheet({ open, onOpenChange, productId, variant }: VariantFormSheetProps) {
    const isEditing = !!variant
    const [isPending, startTransition] = useTransition()

    const { handleSubmit, control, reset } = useForm<VariantCreate>({
        resolver: zodResolver(variantCreateSchema) as Resolver<VariantCreate>,
        defaultValues: {
            productId: productId ?? '',
            weightKg: 0,
            weightLabel: '',
            price: 0,
            earnValue: 0,
            image: '',
            stockQty: 0,
            lowStockThreshold: 0,
            isActive: true,
        },
    })

    useEffect(() => {
        if (variant) {
            reset({
                productId: variant.productId,
                weightKg: variant.weightKg,
                weightLabel: variant.weightLabel,
                price: variant.price,
                earnValue: variant.earnValue,
                image: variant.image,
                stockQty: variant.stockQty,
                lowStockThreshold: variant.lowStockThreshold,
                isActive: variant.isActive,
            })
        } else {
            reset({
                productId: productId ?? '',
                weightKg: 0,
                weightLabel: '',
                price: 0,
                earnValue: 0,
                image: '',
                stockQty: 0,
                lowStockThreshold: 0,
                isActive: true,
            })
        }
    }, [variant, productId, reset])

    function onSubmit(data: VariantCreate) {
        startTransition(async () => {
            const result = isEditing
                ? await updateVariant(variant!.id, data)
                : await createVariant(data)

            if (result && typeof result === 'object' && 'id' in result) {
                toast.success(isEditing ? 'Variant updated.' : 'Variant created.')
                onOpenChange(false)
            } else {
                toast.error('Something went wrong. Please try again.')
            }
        })
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{isEditing ? 'Edit Variant' : 'Add New Variant'}</SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? 'Update the variant details below.'
                            : 'Fill in the details to add a new variant.'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 pb-4">
                    {/* Weight Label */}
                    <Controller
                        name="weightLabel"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Weight Label</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="e.g. 25kg"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Weight (kg) */}
                    <Controller
                        name="weightKg"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Weight (kg)</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.001"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Price */}
                    <Controller
                        name="price"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Earn Value */}
                    <Controller
                        name="earnValue"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Earn Value (points)</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Stock Qty */}
                    <Controller
                        name="stockQty"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Stock Quantity</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Low Stock Threshold */}
                    <Controller
                        name="lowStockThreshold"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Low Stock Threshold</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isPending}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Is Active */}
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex flex-col gap-0.5">
                                    <FieldLabel htmlFor="isActive" className="cursor-pointer">Active</FieldLabel>
                                    <p className="text-muted-foreground text-sm">Show this variant on the storefront</p>
                                </div>
                                <Switch
                                    id="isActive"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                />
                            </div>
                        )}
                    />

                    <SheetFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Variant'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
