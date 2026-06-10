"use client"
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Filter, MoreHorizontal, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import { useUrlParams } from '@/hooks/useUrlParams'
import Link from 'next/link'
import { deleteUser } from '@/actions/mutations'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { DeleteDialog } from '@/components/DeleteDialog'
import { IUser } from '@/types'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'




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

function RowActions({ user }: { user: IUser }) {
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
                        <Link href={`/dashboard/users/${user.id}/edit`}>
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${user.id}`}>
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
                title="Delete user?"
                description={`"${user.name}" will be permanently removed. This action cannot be undone.`}
                onConfirm={() => deleteUser(user.id)}
            />}

        </>
    )
}


export const Columns: ColumnDef<IUser>[] = [
    {
        id: 'row-no',
        header: '#',
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: "image",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Image" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const imageUrl = row.getValue<string | null>("image")
            return imageUrl
                ? <Image src={imageUrl ?? ''} width={200} height={200} alt="User Image" className="w-10 h-10 rounded object-cover" />
                : <div className="w-10 h-10 rounded bg-muted" />
        },
        enableSorting: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" isSorted={column.getIsSorted()} />,
    },
    {
        id: 'tier',
        accessorFn: (row) => row.tier ? row.tier.name : "No Tier",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const tierName = row.getValue("tier") as string
            return <p className={`text-center ${tierName === "No Tier" ? "text-muted" : ""}`}>{tierName}</p>
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" isSorted={column.getIsSorted()} />,
    },
    {
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" isSorted={column.getIsSorted()} />,
    },
    {
        accessorKey: "emailVerified",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email Verified" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const emailVerified = row.getValue("emailVerified")
            return <div className='text-center'><Badge variant={emailVerified ? "success" : "destructive"}>{emailVerified ? "Verified" : "Unverified"}</Badge></div>
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return <Badge variant={'outline'} className=''>{role}</Badge>
        }
    },
    {
        id: 'assigned-agent',
        accessorFn: (row) => row.assignedAgent ? row.assignedAgent.name : "No Agent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned Agent" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const agentName = row.getValue("assigned-agent") as string
            return <p className={`text-center ${agentName === "No Agent" ? "text-muted" : ""}`}>{agentName}</p>
        }
    },
    {
        accessorKey: "banned",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Banned" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => {
            const banned = row.getValue("banned")
            return <Badge variant={banned ? "destructive" : "success"}>{banned ? "Banned" : "Active"}</Badge>
        },
    },
    {
        accessorKey: "country",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Country" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="line-clamp-1">{row.getValue("country")}</p>,
        enableSorting: false,
    },
    {
        accessorKey: "city",
        header: ({ column }) => <DataTableColumnHeader column={column} title="City" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="line-clamp-1">{row.getValue("city")}</p>,
        enableSorting: false,
    },
    {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => (
            <p className={`w-36 truncate ${!row.getValue("address") ? "text-muted" : ""}`}>
                {row.getValue("address") || "No Address"}
            </p>
        ),
        enableSorting: false,
    },
    {
        accessorKey: "totalSpend",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Spend" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="text-center">K{(row.getValue("totalSpend") as number)?.toFixed(2)}</p>,
    },
    {
        accessorKey: "walletBalance",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Wallet Balance" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="text-center">K{(row.getValue("walletBalance") as number)?.toFixed(2)}</p>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" isSorted={column.getIsSorted()} />,
        cell: ({ row }) => <p className="w-20 text-center">{row.getValue("createdAt") ? format(new Date(row?.getValue("createdAt")), 'MMMM yyyy ') : "-"}</p>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return <RowActions user={user} />
        },
    },
]

const ROLES = ['customer', 'agent', 'officer', 'admin'] as const

function RoleFilter() {
    const { updateUrlParams, getParam } = useUrlParams()
    const [isPending, startTransition] = useTransition()

    const selectedRoles = getParam('roles')?.split(',').filter(Boolean) ?? ['customer']

    function toggleRole(role: string) {
        const next = selectedRoles.includes(role)
            ? selectedRoles.filter(r => r !== role)
            : [...selectedRoles, role]
        startTransition(() => {
            updateUrlParams(
                { roles: next.length ? next.join(',') : null, page: '1' },
                { replace: true }
            )
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className='h-8 gap-1' disabled={isPending}>
                    {
                        isPending ? <Spinner className='size-3.5' /> : <Filter className="size-3.5" />
                    }
                    Role
                    {selectedRoles.length > 0 && (
                        <Badge variant="secondary" className="ml-1 rounded-full px-1.5 py-0 text-xs">
                            {selectedRoles.length}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuLabel>Filter by role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ROLES.map(role => (
                    <DropdownMenuCheckboxItem
                        key={role}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() => toggleRole(role)}
                        className="capitalize"
                    >
                        {role}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const toolbarAction = () => (
    <div className='flex items-center gap-2'>
        <RoleFilter />
        <Link href='/dashboard/users/new'>
            <Button size="sm" className="h-8">
                <Plus className="size-3" />
                Add New User
            </Button>
        </Link>
    </div>
)