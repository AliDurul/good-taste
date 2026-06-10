"use client"
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { IOrder } from '@/types'
import { OrderActions } from './OrderActions'
import { ORDER_STATUSES, OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge, PlacedByBadge } from './OrderBadges'
import { useUrlParams } from '@/hooks/useUrlParams'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTransition } from 'react'
import { Spinner } from '@/components/ui/spinner'

export const Columns: ColumnDef<IOrder>[] = [
    {
        id: 'row-no',
        header: '#',
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <Link href={`/dashboard/orders/${row.original.id}`} className="font-mono text-sm font-medium hover:underline">
                GT{row.original.id.slice(0, 8).toUpperCase()}
            </Link>
        ),
        enableSorting: false,
    },
    {
        accessorFn: (row) => row.customer?.name ?? row.customerId,
        id: "customer",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <p className="max-w-[140px] truncate">
                {row.original.customer?.name ?? `${row.original.customerId.slice(0, 8)}…`}
            </p>
        ),
    },
    {
        accessorFn: (row) => row.agent?.name ?? row.agentId,
        id: "agent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <p className="max-w-[140px] truncate">
                {row.original.agent?.name ?? `${row.original.agentId.slice(0, 8)}…`}
            </p>
        ),
    },
    {
        id: "items",
        header: "Items",
        cell: ({ row }) => {
            const items = row.original.items ?? []
            const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-default whitespace-nowrap">
                            {totalQty} item{totalQty === 1 ? '' : 's'}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <ul>
                            {items.map((item) => (
                                <li key={item.id}>{item.quantity} × {item.productName}</li>
                            ))}
                        </ul>
                    </TooltipContent>
                </Tooltip>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: "finalAmount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-medium">K{row.original.finalAmount.toFixed(2)}</span>
                {row.original.discountAmount > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                        −K{row.original.discountAmount.toFixed(2)}
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "placedBy",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Placed By" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <PlacedByBadge placedBy={row.original.placedBy} />,
    },
    {
        accessorKey: "paymentStatus",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <div className="flex flex-wrap items-center gap-1">
                <PaymentStatusBadge status={row.original.paymentStatus} />
                <PaymentMethodBadge method={row.original.paymentMethod} />
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <p className="whitespace-nowrap text-muted-foreground">
                {format(new Date(row.original.createdAt), 'dd MMM yyyy, HH:mm')}
            </p>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <OrderActions order={row.original} showViewDetails />,
    },
]

const ALL_STATUSES = 'all'

function StatusFilter() {

    const { updateUrlParams, getParam } = useUrlParams()
    const [isPending, startTransition] = useTransition()


    const statusFilter = getParam('status') ?? ALL_STATUSES

    return (
        <div className="flex items-center gap-2">
            <Select
                value={statusFilter}
                disabled={isPending}
                onValueChange={(value) =>
                    startTransition(() => {
                        updateUrlParams(
                            { status: value === ALL_STATUSES ? null : value, page: '1' },
                            { replace: true, debounce: 0 }
                        )
                    })
                }
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                    {isPending && <Spinner className='size-3.5 ' />}
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                    {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export const toolbarAction = () => {
    return (
        <div className='flex items-center gap-3'>
            <StatusFilter />
            <Link href={'/dashboard/orders/new'} className='w-full'>
                <Button className='w-full'>
                    <Plus className="size-3" />
                    New Order
                </Button>
            </Link>
        </div>
    )
}
