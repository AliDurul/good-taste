'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    productWithVariantsCreateSchema,
    type ProductWithVariantsCreate,
    type IProductCategory,
} from '@workspace/schemas'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Switch } from '@workspace/ui/components/switch'
import { Field, FieldLabel, FieldError } from '@workspace/ui/components/field'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@workspace/ui/components/select'
import { toast } from 'sonner'
import { ImageIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { createProduct, updateProduct } from '@/actions/mutations'
import { useUploadThing } from '@/lib/uploadthing'

interface ProductFormProps {
    categories: IProductCategory[]
    mode: 'create' | 'edit'
    productId?: string
    defaultValues?: ProductWithVariantsCreate
    existingImageUrl?: string
    originalVariantIds?: string[]
}

export function ProductForm({
    categories,
    mode,
    productId,
    defaultValues,
    existingImageUrl,
    originalVariantIds = [],
}: ProductFormProps) {
    const router = useRouter()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { startUpload, isUploading } = useUploadThing('imageUploader')
    const isEdit = mode === 'edit'

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<ProductWithVariantsCreate>({
        resolver: zodResolver(productWithVariantsCreateSchema) as Resolver<ProductWithVariantsCreate>,
        defaultValues: defaultValues ?? {
            name: '',
            description: '',
            categoryId: '',
            isActive: true,
            image: '',
            variants: [],
        },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'variants' })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        setImageFile(file)
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImagePreview(file ? URL.createObjectURL(file) : null)
    }

    function addVariant() {
        append({
            weightLabel: '',
            weightKg: 0,
            price: 0,
            earnValue: 0,
            stockQty: 0,
            lowStockThreshold: 0,
            isActive: true,
        })
    }

    async function onSubmit(data: ProductWithVariantsCreate) {
        let imageUrl: string | undefined

        if (imageFile) {
            const res = await startUpload([imageFile])
            if (!res?.[0]?.ufsUrl) {
                toast.error('Image upload failed. Please try again.')
                return
            }
            imageUrl = res[0].ufsUrl
        }

        const payload = {
            ...data,
            image: imageUrl ?? (isEdit ? existingImageUrl : undefined),
        }

        let result: { success: boolean; message?: string }

        if (isEdit && productId) {
            result = await updateProduct(productId, payload, originalVariantIds)
        } else {
            const r = await createProduct(payload)
            result = { success: r.success }
        }

        if (result.success) {
            toast.success(isEdit ? 'Product updated successfully.' : 'Product created successfully.')
                if (isEdit) {
                    router.back();
                } else {
                    router.push('/dashboard/products');
                }
        } else {
            toast.error(result.message ?? 'Something went wrong. Please try again.')
        }
    }

    const isLoading = isSubmitting || isUploading

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            {/* ── Product Details ───────────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    <p className="text-sm text-muted-foreground">
                        Basic information about the product.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    {/* Name */}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="e.g. Premium Olive Oil"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Category */}
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Category</FieldLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Is Active */}
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Field orientation="horizontal" className="items-center">
                                <FieldLabel htmlFor={field.name}>Active</FieldLabel>
                                <Switch
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                />
                            </Field>
                        )}
                    />

                    {/* Product Image */}
                    <div className="flex flex-col gap-2">
                        <FieldLabel>Product Image</FieldLabel>
                        <div className="flex items-start gap-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Product preview"
                                    className="h-20 w-20 shrink-0 rounded-xl border object-cover"
                                />
                            ) : isEdit && existingImageUrl ? (
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border">
                                    <Image src={existingImageUrl} alt="Current image" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-muted">
                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex flex-1 flex-col gap-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isLoading}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG or WEBP — up to 4 MB.{' '}
                                    {isEdit ? 'Leave empty to keep the current image.' : 'Optional.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Optional product description..."
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
            </section>

            <div className="border-t" />

            {/* ── Variants ──────────────────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Variants</h3>
                        <p className="text-sm text-muted-foreground">
                            Add weight/price variants for this product.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                        disabled={isLoading}
                    >
                        <PlusIcon className="mr-1.5 h-4 w-4" />
                        Add Variant
                    </Button>
                </div>

                {fields.length === 0 && (
                    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No variants yet. Click &quot;Add Variant&quot; to add one.
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {fields.map((variantField, index) => (
                        <div
                            key={variantField.id}
                            className="flex flex-col gap-4 rounded-xl border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Variant {index + 1}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                    disabled={isLoading}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Weight Label */}
                                <Controller
                                    name={`variants.${index}.weightLabel`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Weight Label</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                placeholder="e.g. 25kg"
                                                aria-invalid={fieldState.invalid}
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Weight (kg) */}
                                <Controller
                                    name={`variants.${index}.weightKg`}
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
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Price */}
                                <Controller
                                    name={`variants.${index}.price`}
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
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Earn Value */}
                                <Controller
                                    name={`variants.${index}.earnValue`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Earn Value</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Stock Qty */}
                                <Controller
                                    name={`variants.${index}.stockQty`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Stock Qty</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                min={0}
                                                step="1"
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Low Stock Threshold */}
                                <Controller
                                    name={`variants.${index}.lowStockThreshold`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Low Stock Threshold</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                min={0}
                                                step="1"
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isLoading}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />

                                {/* Is Active */}
                                <Controller
                                    name={`variants.${index}.isActive`}
                                    control={control}
                                    render={({ field }) => (
                                        <Field orientation="horizontal" className="items-center">
                                            <FieldLabel htmlFor={`${field.name}-${index}`}>Active</FieldLabel>
                                            <Switch
                                                id={`${field.name}-${index}`}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                            />
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => isEdit ? router.back() : router.push('/dashboard/products')}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isUploading
                        ? 'Uploading image...'
                        : isSubmitting
                            ? (isEdit ? 'Saving...' : 'Creating...')
                            : (isEdit ? 'Save Changes' : 'Create Product')}
                </Button>
            </div>
        </form>
    )
}
