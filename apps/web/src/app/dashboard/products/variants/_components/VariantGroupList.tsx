'use client'

import { useState } from 'react'
import { IProduct } from '@workspace/schemas'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@workspace/ui/components/collapsible'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@workspace/ui/components/table'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { ChevronRight, Plus, PackageOpen } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { VariantFormSheet } from './VariantFormSheet'
import { VariantRowActions } from './VariantRowActions'



function ProductGroupSection({ product }: { product: IProduct }) {
    const [open, setOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const variants = product.variants ?? []

    return (
        <>
            <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <CollapsibleTrigger asChild>
                        <button
                            className="flex flex-1 items-center gap-2 text-left"
                            aria-label={`Toggle ${product.name} variants`}
                        >
                            <ChevronRight
                                className={cn(
                                    'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                                    open && 'rotate-90'
                                )}
                            />
                            <div>
                                <p className="font-semibold leading-tight">{product.name}</p>
                                {product.description && (
                                    <p className="text-muted-foreground text-xs">{product.description}</p>
                                )}
                            </div>
                            <Badge variant="secondary" className="ml-2">
                                {variants.length} {variants.length === 1 ? 'variant' : 'variants'}
                            </Badge>
                        </button>
                    </CollapsibleTrigger>

                    <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => setAddOpen(true)}
                    >
                        <Plus className="size-3.5" />
                        Add Variant
                    </Button>
                </div>

                <CollapsibleContent>
                    {variants.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <PackageOpen className="text-muted-foreground size-8" />
                            <p className="text-muted-foreground text-sm">No variants yet.</p>
                        </div>
                    ) : (
                        <div className="border-t">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8">#</TableHead>
                                        <TableHead>Weight</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Earn (pts)</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                        <TableHead className="text-right">Low Stock At</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-center">Out of Stock</TableHead>
                                        <TableHead className="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.map((variant, idx) => (
                                        <TableRow key={variant.id}>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {idx + 1}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {variant.weightLabel}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {variant.price.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {variant.earnValue}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {variant.stockQty}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {variant.lowStockThreshold}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={variant.isActive ? 'success' : 'destructive'}>
                                                    {variant.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {variant.isOutOfStock ? (
                                                    <Badge variant="destructive">Out of Stock</Badge>
                                                ) : (
                                                    <Badge variant="secondary">In Stock</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <VariantRowActions variant={variant} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>

            <VariantFormSheet
                open={addOpen}
                onOpenChange={setAddOpen}
                productId={product.id}
            />
        </>
    )
}

export function VariantGroupList({ groups }: { groups: IProduct[] }) {
    if (groups.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
                <PackageOpen className="text-muted-foreground size-12" />
                <p className="text-muted-foreground">No variants found.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {groups.map((product) => (
                <ProductGroupSection key={product.id} product={product} />
            ))}
        </div>
    )
}
