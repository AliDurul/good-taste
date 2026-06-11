'use client'
import DataTable from '@/components/table/DataTable'
import { useUrlParams } from '@/hooks/useUrlParams'
import { cn } from '@/lib/utils'
import  { useTransition } from 'react'
import { Columns, toolbarAction } from './OrderTableConfig'
import { OrderCard } from './OrderCard'
import { IOrder, PaginatedResponse } from '@/types'


export default function OrderTable({ result }: { result: PaginatedResponse<IOrder> }) {
    const { updateUrlParams } = useUrlParams()
    const [isPending, startTransition] = useTransition()

    return (
        <div className={cn("flex flex-col gap-3 transition-opacity duration-200", isPending && "opacity-50 pointer-events-none")}>
            <DataTable
                columns={Columns}
                data={result?.data || []}
                filterPlaceholder="Search orders..."
                renderToolbarActions={toolbarAction}
                renderMobileRow={(order) => <OrderCard order={order} />}
                apiPagination={result?.pagination}
                onApiPageChange={(page) =>
                    startTransition(() => {
                        updateUrlParams({ page: String(page) }, { replace: true, debounce: 0 })
                    })
                }
                onApiPageSizeChange={(limit) =>
                    startTransition(() => {
                        updateUrlParams({ limit: String(limit), page: "1" }, { replace: true, debounce: 0 })
                    })
                }
            />
        </div>
    )
}
