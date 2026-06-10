import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Coins } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getOrder } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { IOrder } from '@/types'
import { OrderActions } from '../_components/OrderActions'
import { OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge, PlacedByBadge } from '../_components/OrderBadges'

interface OrderPageParams { params: Promise<{ id: string }> }

export default function OrderDetailPage({ params }: OrderPageParams) {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <DataSection label="order details">
                    <OrderDetail params={params} />
                </DataSection>
            </div>
        </div>
    )
}

async function OrderDetail({ params }: OrderPageParams) {
    const { id } = await params
    const result = await getOrder(id)

    if (!result.success) {
        notFound()
    }

    const order = result.data
    const reference = `GT${order.id.slice(0, 8).toUpperCase()}`

    return (
        <div className="flex flex-col gap-6">
            {/* Back */}
            <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
                <Link href="/dashboard/orders">
                    <ArrowLeft className="mr-1 size-4" />
                    Back to Orders
                </Link>
            </Button>

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="font-mono text-2xl font-semibold tracking-tight">{reference}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                        <PaymentMethodBadge method={order.paymentMethod} />
                        <PlacedByBadge placedBy={order.placedBy} />
                    </div>
                </div>
                <Suspense fallback={<Skeleton className="h-8 w-32 rounded-md" />}>
                    <OrderActions order={order} redirectAfterDelete="/dashboard/orders" />
                </Suspense>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Items + amounts */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Items</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.productName}</TableCell>
                                            <TableCell className="text-right">K{item.productPrice.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">K{item.subtotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="ml-auto flex w-full max-w-xs flex-col gap-1.5 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>K{order.totalAmount.toFixed(2)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>−K{order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {order.walletRedeemed > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Wallet redeemed</span>
                                    <span>−K{order.walletRedeemed.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator className="my-1" />
                            <div className="flex justify-between text-base font-semibold">
                                <span>Total due</span>
                                <span>K{order.finalAmount.toFixed(2)}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <span className="text-muted-foreground">Points to earn</span>
                                <Badge variant="outline" className="gap-1 border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                                    <Coins className="size-3" />
                                    +{order.walletEarned.toFixed(2)}
                                </Badge>
                            </div>
                            {order.isFreeDelivery && (
                                <div className="flex justify-end">
                                    <Badge variant="success">Free delivery</Badge>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    {/* People & delivery */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 text-sm">
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Customer</p>
                                <p className="font-medium">{order.customer?.name ?? order.customerId}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Agent</p>
                                <p className="font-medium">{order.agent?.name ?? order.agentId}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Delivery address</p>
                                <p className="font-medium">{order.deliveryAddress ?? '—'}</p>
                            </div>
                            {order.notes && (
                                <div>
                                    <p className="mb-0.5 text-muted-foreground">Notes</p>
                                    <p className="font-medium">{order.notes}</p>
                                </div>
                            )}
                            {order.cancelReason && (
                                <div>
                                    <p className="mb-0.5 text-muted-foreground">Cancel reason</p>
                                    <p className="font-medium text-destructive">{order.cancelReason}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderTimeline order={order} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function OrderTimeline({ order }: { order: IOrder }) {
    const steps: { label: string; at: string | null }[] = [
        { label: 'Placed', at: order.createdAt },
        { label: 'Confirmed', at: order.confirmedAt },
        { label: 'Out for delivery', at: order.outForDeliveryAt },
        { label: 'Delivered', at: order.deliveredAt },
        { label: 'Completed', at: order.completedAt },
    ]
    if (order.cancelledAt) {
        steps.push({ label: 'Cancelled', at: order.cancelledAt })
    }

    return (
        <ol className="flex flex-col gap-3">
            {steps.map((step) => (
                <li key={step.label} className="flex items-center gap-3 text-sm">
                    <span
                        className={
                            step.at
                                ? step.label === 'Cancelled'
                                    ? 'size-2.5 shrink-0 rounded-full bg-red-500'
                                    : 'size-2.5 shrink-0 rounded-full bg-green-500'
                                : 'size-2.5 shrink-0 rounded-full border bg-muted'
                        }
                    />
                    <span className={step.at ? 'font-medium' : 'text-muted-foreground'}>{step.label}</span>
                    <span className="ml-auto text-muted-foreground">
                        {step.at ? format(new Date(step.at), 'dd MMM, HH:mm') : '—'}
                    </span>
                </li>
            ))}
        </ol>
    )
}
