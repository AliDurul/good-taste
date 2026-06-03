'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/DeleteDialog'
import { deleteUser } from '@/actions/mutations'

interface UserActionsProps {
    userId: string
    userName: string
}

export function UserActions({ userId, userName }: UserActionsProps) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/users/${userId}/edit`}>
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
                title="Delete user?"
                description={`"${userName}" will be permanently removed. This action cannot be undone.`}
                onConfirm={async () => {
                    const result = await deleteUser(userId)
                    if (result.success) {
                        router.push('/dashboard/users')
                    }
                    return result
                }}
            />
        </>
    )
}
