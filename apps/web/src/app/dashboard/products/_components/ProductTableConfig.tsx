"use client"
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Badge } from '@workspace/ui/components/badge'
import { ColumnDef } from '@tanstack/react-table'
import { getRoles } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { MoreHorizontal, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@workspace/ui/components/button'
import { useState, useTransition } from 'react'
import Link from 'next/link'
// import { deleteUser, toggleUserActive } from '@/actions/user.action'
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { toast } from 'sonner'
import { Switch } from '@workspace/ui/components/switch'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DeleteDialog } from '@/components/DeleteDialog'
import { IProduct } from '@workspace/schemas'
import Image from 'next/image'
import { deleteProduct } from '@/actions/mutations'




// function ActiveToggle({ user }: { user: IProduct }) {
//     const [checked, setChecked] = useState(user.isActive)
//     const [isPendingTransition, startTransition] = useTransition()

//     async function handleToggle(value: boolean) {
//         setChecked(value)
//         startTransition(async () => {
//             const result = await toggleUserActive(user.id, value)
//             if (!result.success) {
//                 setChecked(!value)
//                 toast.error(result.message)
//             }
//         })
//     }

//     return (
//         <Tooltip>
//             <TooltipTrigger asChild>
//                 <span>
//                     <Switch checked={checked} onCheckedChange={handleToggle} disabled={isPendingTransition} />
//                 </span>
//             </TooltipTrigger>
//             <TooltipContent>
//                 {checked ? 'Active' : 'Inactive'}
//             </TooltipContent>
//         </Tooltip>
//     )

// }

function RowActions({ product }: { product: IProduct }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    return (
        <>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="data-[state=open]:bg-muted size-8"
                    >
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild >
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/products/${product.id}`}>
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={(e) => {
                            e.preventDefault()
                            setMenuOpen(false)
                            setDeleteOpen(true)
                        }}
                    >
                        Delete
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {deleteOpen && <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete product?"
                description={`"${product.name}" will be permanently removed along with all its variants. This action cannot be undone.`}
                onConfirm={() => deleteProduct(product.id)}
            />}

        </>
    )
}

export const Columns: ColumnDef<IProduct>[] = [
    {
        id: 'row-no',
        header: '#',
        cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
        accessorKey: "image",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Image" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const imageUrl = row.getValue<string>("image")
            return imageUrl
                ? <Image src={imageUrl ?? ''} width={200} height={200} alt="Product Image" className="w-10 h-10 rounded object-cover" />
                : <div className="w-10 h-10 rounded bg-muted" />
        },
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" isSorted={column.getIsSorted()} />,
    },
    {
        accessorKey: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="line-clamp-1">{row.getValue("description")}</p>,
        enableSorting: false,
    },
    {
        accessorFn: (row) => row.category?.name,
        id: "category",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Category" isSorted={column.getIsSorted()} />,
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const isActive = row.getValue("isActive")
            return <Badge variant={isActive ? "success" : "destructive"}>{isActive ? "Active" : "Inactive"}</Badge>
        },
    },
    {
        id: "variants",
        accessorFn: (row) => row.variants?.length,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Variants" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="w-20 text-center">{row.getValue("variants") || 0}</p>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="w-20 text-center">{row.getValue("createdAt") ? format(new Date(row?.getValue("createdAt")), 'MMMM yyyy ') : "-"}</p>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;
            return <RowActions product={product} />
        },
    },
]

export const toolbarAction = () => {
    return (
        <div className='flex gap-3 '>
            <Link href={'/dashboard/products/new'} className='w-full'>
                <Button className='w-full'>
                    <Plus className="size-3" />
                    Add New Product
                </Button>
            </Link>
        </div>
    )
}