'use client'

import { useState, useTransition } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { IProductVariant } from '@/types'
import { DeleteDialog } from '@/components/DeleteDialog'
import { deleteVariant } from '@/actions/mutations'
import { VariantFormSheet } from './VariantFormSheet'

interface VariantRowActionsProps {
    variant: IProductVariant
}

export function VariantRowActions({ variant }: VariantRowActionsProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
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
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                            setMenuOpen(false)
                            setEditOpen(true)
                        }}
                    >
                        Edit
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

            <VariantFormSheet
                open={editOpen}
                onOpenChange={setEditOpen}
                variant={variant}
            />

            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Variant"
                description={`Permanently delete the "${variant.weightLabel}" variant? This cannot be undone.`}
                onConfirm={async () => {
                    const result = await deleteVariant(variant.id)
                    if (result && typeof result === 'object' && 'success' in result && !(result as { success: boolean }).success) {
                        return { success: false, message: 'Failed to delete variant.' }
                    }
                    return { success: true, message: 'Variant deleted.' }
                }}
            />
        </>
    )
}
