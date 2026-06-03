"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Async function that performs the delete. Should return `{ success: boolean; message: string }`. */
    onConfirm: () => Promise<{ success: boolean; message: string } | undefined>
    title?: string
    description?: string
}

export function DeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone. This will permanently delete the selected",
}: DeleteDialogProps) {
    const [isPending, startTransition] = useTransition()

    function handleConfirmDelete(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        startTransition(() => {
            void (async () => {
                const res = await onConfirm()
                toast[res?.success ? "success" : "error"](res?.message)

                if (res?.success) {
                    onOpenChange(false)
                }
            })()
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline" disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={handleConfirmDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
