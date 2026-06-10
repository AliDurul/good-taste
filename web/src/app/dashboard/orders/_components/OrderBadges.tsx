import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { OrderPlacedBy, OrderStatus, PaymentMethod, PaymentStatus } from '@/types'
import {
    Banknote,
    BadgeCheck,
    CircleCheck,
    Clock,
    Landmark,
    PackageCheck,
    Smartphone,
    Truck,
    UserRound,
    UserRoundCog,
    ShieldCheck,
    Wallet,
    XCircle,
} from 'lucide-react'

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; className: string }> = {
    pending: {
        label: 'Pending',
        icon: Clock,
        className: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
    },
    confirmed: {
        label: 'Confirmed',
        icon: CircleCheck,
        className: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
    },
    out_for_delivery: {
        label: 'Out for Delivery',
        icon: Truck,
        className: 'border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300',
    },
    delivered: {
        label: 'Delivered',
        icon: PackageCheck,
        className: 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
    },
    completed: {
        label: 'Completed',
        icon: BadgeCheck,
        className: 'border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        className: 'border-red-200 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
    },
}

export const ORDER_STATUSES = Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
    value: value as OrderStatus,
    label,
}))

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
    const Icon = config.icon
    return (
        <Badge variant="outline" className={cn('gap-1 whitespace-nowrap', config.className, className)}>
            <Icon className="size-3" />
            {config.label}
        </Badge>
    )
}

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
    paid: { label: 'Paid', className: 'border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300' },
    pending: { label: 'Unpaid', className: 'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300' },
    failed: { label: 'Failed', className: 'border-red-200 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300' },
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const config = PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.pending
    return <Badge variant="outline" className={cn('whitespace-nowrap', config.className)}>{config.label}</Badge>
}

const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
    cash: { label: 'Cash', icon: Banknote },
    mobile_money: { label: 'Mobile Money', icon: Smartphone },
    bank_transfer: { label: 'Bank Transfer', icon: Landmark },
    wallet: { label: 'Wallet', icon: Wallet },
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
    const config = PAYMENT_METHOD_CONFIG[method] ?? PAYMENT_METHOD_CONFIG.cash
    const Icon = config.icon
    return (
        <Badge variant="outline" className="gap-1 whitespace-nowrap text-muted-foreground">
            <Icon className="size-3" />
            {config.label}
        </Badge>
    )
}

const PLACED_BY_CONFIG: Record<OrderPlacedBy, { label: string; icon: React.ElementType }> = {
    customer: { label: 'Customer', icon: UserRound },
    agent: { label: 'Agent', icon: UserRoundCog },
    officer: { label: 'Officer', icon: ShieldCheck },
}

export function PlacedByBadge({ placedBy }: { placedBy: OrderPlacedBy }) {
    const config = PLACED_BY_CONFIG[placedBy] ?? PLACED_BY_CONFIG.customer
    const Icon = config.icon
    return (
        <Badge variant="secondary" className="gap-1 whitespace-nowrap capitalize">
            <Icon className="size-3" />
            {config.label}
        </Badge>
    )
}
