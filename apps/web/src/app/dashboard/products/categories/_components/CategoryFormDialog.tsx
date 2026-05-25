'use client'

import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoryCreateSchema, type CategoryCreate, type IProductCategory } from '@workspace/schemas'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { toast } from 'sonner'
import { createCategory, updateCategory } from '@/actions/mutations'
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field'

const DEFAULT_VALUES: CategoryCreate = {
    name: '',
    description: '',
    isActive: true,
}

interface CategoryFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: IProductCategory | null
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
    const isEditing = Boolean(category)

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CategoryCreate>({
        resolver: zodResolver(categoryCreateSchema) as Resolver<CategoryCreate>,
        defaultValues: DEFAULT_VALUES,
    })

    useEffect(() => {
        if (open) {
            reset(
                category
                    ? {
                        name: category.name,
                        description: category.description ?? '',
                        isActive: category.isActive,
                    }
                    : DEFAULT_VALUES,
            )
        }
    }, [open, category, reset])

    async function onSubmit(data: CategoryCreate) {
        const result = isEditing && category
            ? await updateCategory(category.id, data)
            : await createCategory(data)
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
                    <DialogTitle>{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Category name"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <Textarea
                                        id={field.name}
                                        placeholder="Optional description..."
                                        {...field}
                                        value={field.value ?? ''}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <Label htmlFor="cat-active">Active</Label>
                            <p className="text-xs text-muted-foreground">
                                Inactive categories are hidden from the storefront.
                            </p>
                        </div>
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="cat-active"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                />
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
                                ? isEditing ? 'Saving…' : 'Creating…'
                                : isEditing ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
