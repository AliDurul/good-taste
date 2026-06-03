import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { getCategories, getProduct } from '@/actions/queries'
import { ProductForm } from '../../_components/ProductForm'
import { IPageParams } from '@/types'

export default function EditProductPage({ params }: IPageParams) {
    return (
        <div className="flex flex-col gap-8 p-4">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight">Edit Product</h2>
                <p className="text-muted-foreground">
                    Update the details below to modify this product.
                </p>
            </div>

            {/* Form */}
            <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
                <EditProductContent params={params} />
            </Suspense>
        </div>
    )
}

async function EditProductContent({ params }: IPageParams) {
    const { slug } = await params

    const [productResult, categoriesResult] = await Promise.all([
        getProduct(slug),
        getCategories(),
    ])

    if (!productResult.success) notFound()

    const product = productResult.data
    const productImage = (product as unknown as { image?: string }).image

    const defaultVariants = (product.variants ?? []).map((v) => ({
        id: v.id,
        weightLabel: v.weightLabel,
        weightKg: v.weightKg,
        price: v.price,
        earnValue: v.earnValue,
        stockQty: v.stockQty,
        lowStockThreshold: v.lowStockThreshold,
        isActive: v.isActive,
    }))

    return (
        <>
            {/* Back button */}
            <Button variant="ghost" size="sm" className="self-start" asChild>
                <Link href={`/dashboard/products/${slug}`}>
                    <ChevronLeftIcon className="mr-1.5 h-4 w-4" />
                    Back to Product
                </Link>
            </Button>

            {/* Form */}
            <div className="rounded-xl border p-6">
                <ProductForm
                    mode="edit"
                    productId={product.id}
                    categories={categoriesResult.data ?? []}
                    existingImageUrl={productImage}
                    originalVariantIds={(product.variants ?? []).map((v) => v.id)}
                    defaultValues={{
                        name: product.name,
                        description: product.description ?? '',
                        categoryId: product.categoryId,
                        isActive: product.isActive,
                        image: '',
                        variants: defaultVariants,
                    }}
                />
            </div>
        </>
    )
}
