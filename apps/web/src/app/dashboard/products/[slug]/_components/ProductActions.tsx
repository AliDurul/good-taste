'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { DeleteDialog } from '@/components/DeleteDialog'
import { deleteProduct } from '@/actions/mutations'

interface ProductActionsProps {
    productId: string
    productName: string
}

export function ProductActions({ productId, productName }: ProductActionsProps) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/products/${productId}/edit`}>
                        <Pencil className="mr-1.5 size-4" />
                        Edit
                    </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                    <Trash2 className="mr-1.5 size-4" />
                    Delete
                </Button>
            </div>

            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete product?"
                description={`"${productName}" will be permanently removed along with all its variants. This action cannot be undone.`}
                onConfirm={async () => {
                    const result = await deleteProduct(productId)
                    if (result.success) {
                        router.push('/dashboard/products')
                    }
                    return result
                }}
            />
        </>
    )
}
