'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Calculator, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { createOrder, previewOrder } from '@/actions/mutations'
import { orderCreateFormSchema, type OrderCreateForm } from '@/schemas'
import type { IOrderPreviewData, IProduct, IUser } from '@/types'

const DEFAULT_VALUES: OrderCreateForm = {
    customerId: '',
    agentId: undefined,
    items: [{ productId: '', quantity: 1 }],
    walletRedeemed: 0,
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    deliveryAddress: '',
    notes: '',
}

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'wallet', label: 'Wallet' },
] as const

interface OrderFormProps {
    customers: IUser[]
    agents: IUser[]
    products: IProduct[]
}

export function OrderForm({ customers, agents, products }: OrderFormProps) {
    const router = useRouter()
    const [preview, setPreview] = useState<IOrderPreviewData | null>(null)
    const [isPreviewing, startPreview] = useTransition()

    const { control, handleSubmit, getValues, formState: { isSubmitting } } = useForm<OrderCreateForm>({
        resolver: zodResolver(orderCreateFormSchema) as Resolver<OrderCreateForm>,
        defaultValues: DEFAULT_VALUES,
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'items' })

    const customerId = useWatch({ control, name: 'customerId' })
    const selectedCustomer = customers.find((c) => c.id === customerId)
    const needsAgent = !!selectedCustomer && !selectedCustomer.assignedAgentId

    function handlePreview() {
        const items = getValues('items').filter((item) => item.productId)
        if (items.length === 0) {
            toast.error('Add at least one item to preview.')
            return
        }
        startPreview(async () => {
            const result = await previewOrder({ items, walletRedeemed: getValues('walletRedeemed') ?? 0 })
            if (result.success) {
                setPreview(result.data)
            } else {
                toast.error(result.message)
            }
        })
    }

    async function onSubmit(data: OrderCreateForm) {
        if (needsAgent && !data.agentId) {
            toast.error('This customer has no assigned agent — please select one.')
            return
        }
        const result = await createOrder({
            ...data,
            agentId: data.agentId || undefined,
            deliveryAddress: data.deliveryAddress || undefined,
            notes: data.notes || undefined,
        })
        if (result.success) {
            toast.success(result.message)
            router.push('/dashboard/orders')
        } else {
            toast.error(result.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-8 lg:col-span-2">
                {/* ── Customer ─────────────────────────────────────────── */}
                <section className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-semibold">Customer</h3>
                        <p className="text-sm text-muted-foreground">Who is this order for?</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Controller
                            name="customerId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Customer</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id}>
                                                    {customer.name}{customer.city ? ` — ${customer.city}` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        {needsAgent && (
                            <Controller
                                name="agentId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Agent</FieldLabel>
                                        <Select value={field.value ?? ''} onValueChange={field.onChange} disabled={isSubmitting}>
                                            <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                <SelectValue placeholder="Select an agent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agents.map((agent) => (
                                                    <SelectItem key={agent.id} value={agent.id}>
                                                        {agent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            This customer has no assigned agent — pick who will deliver.
                                        </p>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        )}
                    </div>
                </section>

                <div className="border-t" />

                {/* ── Items ────────────────────────────────────────────── */}
                <section className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-semibold">Items</h3>
                        <p className="text-sm text-muted-foreground">Products and quantities for this order.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {fields.map((fieldItem, index) => (
                            <div key={fieldItem.id} className="flex items-end gap-3">
                                <Controller
                                    name={`items.${index}.productId`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field className="flex-1" data-invalid={fieldState.invalid}>
                                            <FieldLabel>Product</FieldLabel>
                                            <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                                <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={product.id} disabled={product.stockQty <= 0}>
                                                            {product.name} ({product.weightKg}kg) — K{product.price.toFixed(2)}
                                                            {product.stockQty <= 0 ? ' — out of stock' : ` — ${product.stockQty} in stock`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name={`items.${index}.quantity`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field className="w-24" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Qty</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="number"
                                                min={1}
                                                step="1"
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                                                aria-invalid={fieldState.invalid}
                                                disabled={isSubmitting}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 text-destructive hover:text-destructive"
                                    onClick={() => remove(index)}
                                    disabled={isSubmitting || fields.length === 1}
                                >
                                    <Trash2 className="size-4" />
                                    <span className="sr-only">Remove item</span>
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => append({ productId: '', quantity: 1 })}
                            disabled={isSubmitting}
                        >
                            <Plus className="size-3" />
                            Add Item
                        </Button>
                    </div>
                </section>

                <div className="border-t" />

                {/* ── Payment & Delivery ───────────────────────────────── */}
                <section className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-semibold">Payment & Delivery</h3>
                        <p className="text-sm text-muted-foreground">How the customer pays and where the order goes.</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        <Controller
                            name="paymentMethod"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Payment Method</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_METHODS.map((method) => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="paymentStatus"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Payment Status</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="walletRedeemed"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Wallet Redeemed</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {selectedCustomer && (
                                        <p className="text-xs text-muted-foreground">
                                            Balance: K{selectedCustomer.walletBalance.toFixed(2)}
                                        </p>
                                    )}
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="deliveryAddress"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="sm:col-span-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Delivery Address</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Leave empty to use the customer's address"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="notes"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="sm:col-span-3" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        placeholder="Optional notes for this order..."
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </section>

                {/* ── Actions ──────────────────────────────────────────── */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard/orders')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Order'}
                    </Button>
                </div>
            </div>

            {/* ── Preview ──────────────────────────────────────────────── */}
            <div className="lg:col-span-1">
                <Card className="lg:sticky lg:top-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2">
                            Order Preview
                            <Button type="button" variant="outline" size="sm" onClick={handlePreview} disabled={isPreviewing || isSubmitting}>
                                <Calculator className="size-3.5" />
                                {isPreviewing ? 'Calculating...' : 'Preview Totals'}
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!preview ? (
                            <p className="text-sm text-muted-foreground">
                                Add items, then preview to see totals, discounts and loyalty points before creating the order.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2 text-sm">
                                {preview.lineItems.map((line) => (
                                    <div key={line.productId} className="flex items-center justify-between gap-2">
                                        <span className="truncate text-muted-foreground">
                                            {line.quantity} × {line.productName}
                                        </span>
                                        <span>K{line.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                                <Separator className="my-1" />
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>K{preview.totalAmount.toFixed(2)}</span>
                                </div>
                                {preview.promotion && (
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-muted-foreground">Promotion</span>
                                        <Badge variant="success">{preview.promotion.name}</Badge>
                                    </div>
                                )}
                                {preview.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Discount</span>
                                        <span>−K{preview.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {preview.walletRedeemed > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Wallet redeemed</span>
                                        <span>−K{preview.walletRedeemed.toFixed(2)}</span>
                                    </div>
                                )}
                                {preview.isFreeDelivery && (
                                    <div className="flex justify-end">
                                        <Badge variant="success">Free delivery</Badge>
                                    </div>
                                )}
                                <Separator className="my-1" />
                                <div className="flex justify-between text-base font-semibold">
                                    <span>Amount due</span>
                                    <span>K{preview.amountDue.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Points earned</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        +{preview.walletEarned.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
