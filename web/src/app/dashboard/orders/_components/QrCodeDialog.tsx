'use client'

import { QRCodeSVG } from 'qrcode.react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { IDeliverOrderData, IQRCodeItemSummary } from '@/types'
import { Coins, ScanLine, TimerIcon } from 'lucide-react'

interface QrCodeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: IDeliverOrderData | null
}

function parseItemsSummary(itemsSummary: IDeliverOrderData['itemsSummary'] | string): IQRCodeItemSummary[] {
    if (!itemsSummary) return []
    if (Array.isArray(itemsSummary)) return itemsSummary
    try {
        const parsed = JSON.parse(itemsSummary)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function QrCodeDialog({ open, onOpenChange, data }: QrCodeDialogProps) {
    if (!data) return null

    const pointsToCredit = data.amountToCredit ?? data.pointsToCredit ?? 0
    const items = parseItemsSummary(data.itemsSummary)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ScanLine className="size-5 text-primary" />
                        Delivery QR Code
                    </DialogTitle>
                    <DialogDescription>
                        Ask the customer to scan this code in the Good Taste app to complete the order and credit their points.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4">
                    <div className="w-full max-w-[280px] rounded-xl border bg-white p-4 shadow-sm">
                        <QRCodeSVG
                            value={data.qrCode}
                            size={256}
                            level="M"
                            marginSize={1}
                            className="h-auto w-full"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {data.orderReference && (
                            <Badge variant="outline" className="font-mono text-sm">{data.orderReference}</Badge>
                        )}
                        <Badge variant="outline" className="gap-1 border-green-200 bg-green-100 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
                            <Coins className="size-3" />
                            +{pointsToCredit.toFixed(2)} points
                        </Badge>
                        <Badge variant="outline" className="gap-1 text-muted-foreground">
                            <TimerIcon className="size-3" />
                            Expires {format(new Date(data.expiresAt), 'dd MMM, HH:mm')}
                        </Badge>
                    </div>

                    {items.length > 0 && (
                        <div className="w-full">
                            <Separator className="mb-3" />
                            <ul className="flex flex-col gap-1.5 text-sm">
                                {items.map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-2">
                                        <span className="truncate text-muted-foreground">
                                            {item.qty} × {item.name}
                                        </span>
                                        <span className="font-medium">K{item.subtotal.toFixed(2)}</span>
                                    </li>
                                ))}
                                {data.totalAmount != null && (
                                    <li className="mt-1 flex items-center justify-between gap-2 border-t pt-2">
                                        <span className="font-medium">Total</span>
                                        <span className="font-semibold">K{data.totalAmount.toFixed(2)}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full sm:w-auto">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
