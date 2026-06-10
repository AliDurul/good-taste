'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CheckCircle2, MoreHorizontal, QrCode, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { DeleteDialog } from '@/components/DeleteDialog'
import { confirmOrder, deleteOrder, deliverOrder, updateOrder } from '@/actions/mutations'
import { orderCancelSchema, type OrderCancel } from '@/schemas'
import type { IDeliverOrderData, IOrder } from '@/types'
import { cn } from '@/lib/utils'
import { QrCodeDialog } from './QrCodeDialog'

function hasActiveQr(order: IOrder): boolean {
    return (
        !!order.qrCode &&
        !order.qrCode.isUsed &&
        new Date(order.qrCode.expiresAt) > new Date()
    )
}

function qrDataFromOrder(order: IOrder): IDeliverOrderData | null {
    if (!order.qrCode) return null
    return {
        orderId: order.id,
        orderReference: order.qrCode.orderReference,
        qrCode: order.qrCode.code,
        expiresAt: order.qrCode.expiresAt,
        totalAmount: order.qrCode.totalAmount,
        amountToCredit: order.qrCode.amountToCredit,
        itemsSummary: order.qrCode.itemsSummary,
    }
}

interface OrderActionsProps {
    order: IOrder
    /** show a "View Details" link in the dropdown (table rows only) */
    showViewDetails?: boolean
    /** navigate here after a successful delete (detail page) */
    redirectAfterDelete?: string
}

export function OrderActions({ order, showViewDetails = false, redirectAfterDelete }: OrderActionsProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [cancelOpen, setCancelOpen] = useState(false)
    const [qrOpen, setQrOpen] = useState(false)
    const [qrData, setQrData] = useState<IDeliverOrderData | null>(null)

    const canConfirm = order.status === 'pending'
    const canDeliver = order.status === 'confirmed' || order.status === 'out_for_delivery'
    const canMarkOutForDelivery = order.status === 'confirmed'
    const canCancel = order.status === 'pending' || order.status === 'confirmed'
    const canShowQr = order.status === 'delivered' && hasActiveQr(order)

    function handleConfirm() {
        startTransition(async () => {
            const result = await confirmOrder(order.id)
            toast[result.success ? 'success' : 'error'](result.message)
            if (result.success) router.refresh()
        })
    }

    function handleDeliver() {
        startTransition(async () => {
            const result = await deliverOrder(order.id)
            if (!result.success) {
                toast.error(result.message)
                return
            }
            toast.success('Delivery confirmed. Show the QR to the customer.')
            setQrData(result.data)
            setQrOpen(true)
            router.refresh()
        })
    }

    function handleOutForDelivery() {
        startTransition(async () => {
            const result = await updateOrder(order.id, { status: 'out_for_delivery' })
            toast[result.success ? 'success' : 'error'](result.success ? 'Order marked as out for delivery.' : result.message)
            if (result.success) router.refresh()
        })
    }

    function handleShowQr() {
        const data = qrDataFromOrder(order)
        if (!data) return
        setQrData(data)
        setQrOpen(true)
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                {/* Quick action — the next step in the workflow, colorful and one click away */}
                {canConfirm && (
                    <Button
                        size="sm"
                        className="h-7 gap-1 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleConfirm}
                        disabled={isPending}
                    >
                        <CheckCircle2 className="size-3.5" />
                        {isPending ? 'Confirming...' : 'Confirm'}
                    </Button>
                )}
                {canDeliver && (
                    <Button
                        size="sm"
                        className="h-7 gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={handleDeliver}
                        disabled={isPending}
                    >
                        <QrCode className="size-3.5" />
                        {isPending ? 'Delivering...' : 'Deliver'}
                    </Button>
                )}
                {canShowQr && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950"
                        onClick={handleShowQr}
                    >
                        <QrCode className="size-3.5" />
                        Show QR
                    </Button>
                )}

                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
                            <MoreHorizontal />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {showViewDetails && (
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                            </DropdownMenuItem>
                        )}
                        {canMarkOutForDelivery && (
                            <DropdownMenuItem onSelect={handleOutForDelivery} disabled={isPending}>
                                <Truck className="size-4" />
                                Mark Out for Delivery
                            </DropdownMenuItem>
                        )}
                        {(showViewDetails || canMarkOutForDelivery) && <DropdownMenuSeparator />}
                        {canCancel && (
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault()
                                    setMenuOpen(false)
                                    setCancelOpen(true)
                                }}
                            >
                                Cancel Order
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            variant="destructive"
                            onSelect={(e) => {
                                e.preventDefault()
                                setMenuOpen(false)
                                setDeleteOpen(true)
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {deleteOpen && (
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    title="Delete order?"
                    description={`Order GT${order.id.slice(0, 8).toUpperCase()} will be permanently removed. This action cannot be undone.`}
                    onConfirm={async () => {
                        const result = await deleteOrder(order.id)
                        if (result.success) {
                            if (redirectAfterDelete) {
                                router.push(redirectAfterDelete)
                            } else {
                                router.refresh()
                            }
                        }
                        return result
                    }}
                />
            )}

            {cancelOpen && (
                <CancelOrderDialog
                    open={cancelOpen}
                    onOpenChange={setCancelOpen}
                    orderId={order.id}
                    onCancelled={() => router.refresh()}
                />
            )}

            <QrCodeDialog open={qrOpen} onOpenChange={setQrOpen} data={qrData} />
        </>
    )
}

function CancelOrderDialog({
    open,
    onOpenChange,
    orderId,
    onCancelled,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderId: string
    onCancelled: () => void
}) {
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<OrderCancel>({
        resolver: zodResolver(orderCancelSchema),
        defaultValues: { cancelReason: '' },
    })

    async function onSubmit(data: OrderCancel) {
        const result = await updateOrder(orderId, { status: 'cancelled', cancelReason: data.cancelReason })
        toast[result.success ? 'success' : 'error'](result.success ? 'Order cancelled.' : result.message)
        if (result.success) {
            onOpenChange(false)
            onCancelled()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-md')}>
                <DialogHeader>
                    <DialogTitle>Cancel order?</DialogTitle>
                    <DialogDescription>
                        Stock will be restored and any redeemed wallet amount refunded to the customer.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Controller
                        name="cancelReason"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Why is this order being cancelled?"
                                    aria-invalid={fieldState.invalid}
                                    disabled={isSubmitting}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Keep Order
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isSubmitting}>
                            {isSubmitting ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
