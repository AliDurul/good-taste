'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    productCreateSchema,
    type ProductCreate,
} from '@/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { createProduct, updateProduct } from '@/actions/mutations'
import { useUploadThing } from '@/lib/uploadthing'
import { IProductCategory } from '@/types'

const DEFAULT_VALUES: ProductCreate = {
    name: '',
    description: '',
    categoryId: '',
    isActive: true,
    image: '',
    weightKg: 0,
    price: 0,
    stockQty: 0,
    lowStockThreshold: 0,
}

interface ProductFormProps {
    categories: IProductCategory[]
    mode: 'create' | 'edit'
    productId?: string
    defaultValues?: Partial<ProductCreate>
    existingImageUrl?: string
}

export function ProductForm({
    categories,
    mode,
    productId,
    defaultValues,
    existingImageUrl,
}: ProductFormProps) {
    const router = useRouter()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { startUpload, isUploading } = useUploadThing('imageUploader')
    const isEdit = mode === 'edit'

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<ProductCreate>({
        resolver: zodResolver(productCreateSchema) as Resolver<ProductCreate>,
        defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
    })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        setImageFile(file)
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImagePreview(file ? URL.createObjectURL(file) : null)
    }

    async function onSubmit(data: ProductCreate) {
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
            result = await updateProduct(productId, payload)
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
                                    placeholder="Product name"
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
                    <Controller
                        name="image"
                        control={control}
                        render={({ field, fieldState }) => (
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
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </div>
                                </div>
                            </div>
                        )}

                    />

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

            {/* ── Commercial & Stock ───────────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <div>
                    <h3 className="text-lg font-semibold">Commercial & Stock</h3>
                    <p className="text-sm text-muted-foreground">
                        Pricing, weight and stock management for this product.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                                    step="0.01"
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
                                    step="1"
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
                        name="stockQty"
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
                                    step="1"
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                    aria-invalid={fieldState.invalid}
                                    disabled={isLoading}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
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
