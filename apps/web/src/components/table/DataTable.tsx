'use client'
import { useEffect, useRef, useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
    PaginationState,
    Updater,
    type Table as TanstackTable
} from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { ChevronsLeft, ChevronsRight, Settings2, X } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import SearchInput from "../SearchInput"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    initialColumnVisibility?: VisibilityState
    filterPlaceholder?: string
    renderToolbarActions?: (table: TanstackTable<TData>) => React.ReactNode
    apiPagination?: ApiPagination
    onApiPageChange?: (page: number) => void
    onApiPageSizeChange?: (limit: number) => void
}

type ApiPagination = {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    initialColumnVisibility,
    filterPlaceholder,
    renderToolbarActions,
    apiPagination,
    onApiPageChange,
    onApiPageSizeChange }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility ?? {})
    const [rowSelection, setRowSelection] = useState({})
    const isSyncingFromApiRef = useRef(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: (apiPagination?.page ?? 1) - 1,
        pageSize: apiPagination?.limit ?? 20,
    })

    useEffect(() => {
        if (!apiPagination) return
        isSyncingFromApiRef.current = true
        setPagination({
            pageIndex: Math.max(apiPagination.page - 1, 0),
            pageSize: apiPagination.limit,
        })
    }, [apiPagination])

    useEffect(() => {
        if (!apiPagination) return

        if (isSyncingFromApiRef.current) {
            isSyncingFromApiRef.current = false
            return
        }

        if (pagination.pageIndex !== Math.max(apiPagination.page - 1, 0)) {
            onApiPageChange?.(pagination.pageIndex + 1)
        }

        if (pagination.pageSize !== apiPagination.limit) {
            onApiPageSizeChange?.(pagination.pageSize)
        }
    }, [
        apiPagination,
        pagination.pageIndex,
        pagination.pageSize,
        onApiPageChange,
        onApiPageSizeChange,
    ])

    const table = useReactTable({
        data,
        columns,
        manualPagination: !!apiPagination,
        pageCount: apiPagination?.totalPages,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updater: Updater<PaginationState>) => {
            setPagination((old) => (typeof updater === "function" ? updater(old) : updater))
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination
        },
        initialState: {
            pagination: { pageSize: 20, },
        },
    })

    const currentPage = table.getState().pagination.pageIndex + 1
    const [pageInput, setPageInput] = useState(`${currentPage}`)
    const canPrev = apiPagination ? apiPagination.hasPreviousPage : table.getCanPreviousPage()
    const canNext = apiPagination ? apiPagination.hasNextPage : table.getCanNextPage()

    useEffect(() => {
        setPageInput(`${currentPage}`)
    }, [currentPage])

    const isFiltered = table.getState().columnFilters.length > 0
    // const statuses = [
    //     {
    //         value: "backlog",
    //         label: "Backlog",
    //         icon: HelpCircle,
    //     },
    //     {
    //         value: "todo",
    //         label: "Todo",
    //         icon: Circle,
    //     },
    //     {
    //         value: "in progress",
    //         label: "In Progress",
    //         icon: Timer,
    //     },
    //     {
    //         value: "done",
    //         label: "Done",
    //         icon: CheckCircle,
    //     },
    //     {
    //         value: "canceled",
    //         label: "Canceled",
    //         icon: CircleOff,
    //     },
    // ]

    return (
        <div className="flex flex-col gap-4">
            {/* toolbar */}
            <div
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0"
            >
                {/* Left section: search and filters */}
                <div className="flex flex-col gap-2 w-full sm:flex-1 sm:flex-row sm:items-center sm:gap-2">
                    <div className="w-full sm:w-auto">
                        <SearchInput className="w-full sm:w-37.5 lg:w-72" placeholder={filterPlaceholder} />
                    </div>
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => table.resetColumnFilters()}
                        >
                            Reset
                            <X />
                        </Button>
                    )}
                </div>
                {/* Right section: view and actions */}
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto h-8"
                            >
                                <Settings2 />
                                <span className="ml-1">View</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-37.5">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-full sm:w-auto">{renderToolbarActions?.(table)}</div>
                </div>
            </div>
            {/* table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            <div className="mt-4 flex flex-col-reverse items-center justify-between gap-3 md:flex-row">
                {
                    table.getFilteredSelectedRowModel().rows.length > 0 &&
                    <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                }
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink
                                size="icon"
                                aria-label="Go to first page"
                                aria-disabled={!canPrev}
                                disabled={!canPrev}
                                onClick={(event) => {
                                    event.preventDefault()
                                    table.setPageIndex(0)
                                }}
                            >
                                <ChevronsLeft className="size-5" />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationPrevious
                                aria-disabled={!canPrev}
                                onClick={() => table.previousPage()}
                                disabled={!canPrev}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <div className="flex items-center gap-2 px-2 text-md whitespace-nowrap">
                                <span>Page</span>
                                <Input
                                    type="number"
                                    min={1}
                                    max={table.getPageCount()}
                                    value={pageInput}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setPageInput(value)

                                        if (!value) return

                                        const maxPage = Math.max(table.getPageCount(), 1)
                                        const nextPage = Math.min(Math.max(Number(value), 1), maxPage)

                                        if (Number.isNaN(nextPage)) return
                                        table.setPageIndex(nextPage - 1)
                                    }}
                                    className="w-15 text-center font-extrabold"
                                    aria-label="Current page"
                                />
                                <p >of <span className=" pl-1">{table.getPageCount()}</span></p>
                            </div>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                aria-disabled={!canNext}
                                onClick={() => table.nextPage()}
                                disabled={!canNext}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                size="icon"
                                aria-label="Go to last page"
                                aria-disabled={!canNext}
                                disabled={!canNext}
                                onClick={(event) => {
                                    event.preventDefault()
                                    table.setPageIndex(table.getPageCount() - 1)
                                }}
                            >
                                <ChevronsRight className="size-5" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                <Field orientation="horizontal" className="w-fit">
                    <FieldLabel htmlFor="select-rows-per-page" className="whitespace-nowrap">Rows per page</FieldLabel>
                    <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
                        <SelectTrigger className="w-18" id="select-rows-per-page">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" className="min-w-10">
                            <SelectGroup>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </div>
        </div >
    )
}
