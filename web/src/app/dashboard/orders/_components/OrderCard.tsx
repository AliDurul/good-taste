'use client'
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IOrder } from '@/types'
import { OrderActions } from './OrderActions'
import { OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge, PlacedByBadge } from './OrderBadges'

export function OrderCard({ order }: { order: IOrder }) {
    const items = order.items ?? []
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Card size="sm">
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <Link href={`/dashboard/orders/${order.id}`} className="font-mono text-sm font-medium hover:underline">
                        GT{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                    <OrderStatusBadge status={order.status} />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="max-w-[60%] truncate text-right">
                        {order.customer?.name ?? `${order.customerId.slice(0, 8)}…`}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Agent</span>
                    <span className="max-w-[60%] truncate text-right">
                        {order.agent?.name ?? `${order.agentId.slice(0, 8)}…`}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Items</span>
                    <span className="text-right">
                        {totalQty} item{totalQty === 1 ? '' : 's'}
                        {items.length > 0 && (
                            <span className="text-muted-foreground"> ({items.map((item) => `${item.quantity}× ${item.productName}`).join(', ')})</span>
                        )}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Total</span>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="font-medium">K{order.finalAmount.toFixed(2)}</span>
                        {order.discountAmount > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                                −K{order.discountAmount.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted-foreground">Payment</span>
                    <div className="flex flex-wrap items-center justify-end gap-1">
                        <PaymentStatusBadge status={order.paymentStatus} />
                        <PaymentMethodBadge method={order.paymentMethod} />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Placed By</span>
                    <PlacedByBadge placedBy={order.placedBy} />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Date</span>
                    <span className="whitespace-nowrap text-right text-muted-foreground">
                        {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2 border-t">
                <OrderActions order={order} showViewDetails />
            </CardFooter>
        </Card>
    )
}
