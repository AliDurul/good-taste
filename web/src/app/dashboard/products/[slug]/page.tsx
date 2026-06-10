import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { getProduct } from '@/actions/queries'
import { ProductActions } from './_components/ProductActions'
import { DataSection } from '@/components/DataSection'
import { IPageParams } from '@/types'

export default function ProductDetailPage({ params }: IPageParams) {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <DataSection label="product details">
                    <ProductDetail params={params} />
                </DataSection>
            </div>
        </div>
    )
}

async function ProductDetail({ params }: IPageParams) {
    const { slug } = await params
    const result = await getProduct(slug)

    if (!result.success) {
        notFound()
    }

    const product = result.data
    const image = (product as unknown as { image?: string }).image
    const isValidImage = !!image && (image.startsWith('http://') || image.startsWith('https://'))

    return (
        <div className="flex flex-col gap-6">
            {/* Back */}
            <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
                <Link href="/dashboard/products">
                    <ArrowLeft className="mr-1 size-4" />
                    Back to Products
                </Link>
            </Button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
                    {product.category?.name && (
                        <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    )}
                </div>
                <Suspense fallback={
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                }>
                    <ProductActions productId={product.id} productName={product.name} />
                </Suspense>
            </div>

            {/* Details + Image */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Category</p>
                                <p className="font-medium">{product.category?.name ?? '—'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Status</p>
                                <Badge variant={product.isActive ? 'success' : 'destructive'}>
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Created</p>
                                <p className="font-medium">{format(new Date(product.createdAt), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{format(new Date(product.updatedAt), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Weight</p>
                                <p className="font-medium">{product.weightKg} kg</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Price</p>
                                <p className="font-medium">K{product.price.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Earn Value</p>
                                <p className="font-medium">{product.earnValue}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Stock</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{product.stockQty}</p>
                                    {product.stockQty <= product.lowStockThreshold && (
                                        <Badge variant="outline">Low</Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Low Stock Threshold</p>
                                <p className="font-medium">{product.lowStockThreshold}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Last Restocked</p>
                                <p className="font-medium">
                                    {product.lastRestockedAt
                                        ? format(new Date(product.lastRestockedAt), 'dd MMM yyyy')
                                        : '—'}
                                </p>
                            </div>
                        </div>
                        {product.description && (
                            <>
                                <Separator />
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm">{product.description}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isValidImage ? (
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                                <Image src={image!} alt={product.name} fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted">
                                <p className="text-sm text-muted-foreground">No image</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

