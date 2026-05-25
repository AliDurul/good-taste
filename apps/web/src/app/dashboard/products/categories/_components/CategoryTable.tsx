'use client'
import DataTable from '@/components/table/DataTable'
import { useUrlParams } from '@/hooks/useUrlParams'
import { cn } from '@workspace/ui/lib/utils'
import React, { useTransition } from 'react'
import { Columns, CategoryToolbarActions } from './CategoryTableConfig'
import {  IProductCategory, PaginatedResponse } from '@workspace/schemas'

export default function CategoryTable({result}: {result: PaginatedResponse<IProductCategory>}) {
    const { updateUrlParams } = useUrlParams()
    const [isPending, startTransition] = useTransition()
    return (
        <div className={cn("transition-opacity duration-200", isPending && "opacity-50 pointer-events-none")}>
            <DataTable
                columns={Columns}
                data={result?.data || []}
                initialColumnVisibility={{  }}
                filterPlaceholder="Search by category name..."
                renderToolbarActions={CategoryToolbarActions}
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
