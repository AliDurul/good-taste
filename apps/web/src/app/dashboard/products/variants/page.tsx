import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getVariants } from '@/actions/queries'
import { VariantGroupList } from './_components/VariantGroupList'
import { IProductVariantWithProduct } from '@workspace/schemas'

export default function page() {
    return (
        <div className='rounded-md border'>
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Product Variants
                    </h2>
                    <p className="text-muted-foreground">
                        Manage weight variants for each product. Expand a product to view, add, edit or remove its variants.
                    </p>
                </div>
                <DataSection label="variants">
                    <Variants />
                </DataSection>
            </div>
        </div>
    )
}

async function Variants() {
    const result = await getVariants({ includeProduct: 'true', limit: '500' })

    // Group variants by productId
    const groupMap = new Map<string, {
        productId: string
        productName: string
        productDescription?: string
        variants: IProductVariantWithProduct[]
    }>()

    for (const variant of result.data) {
        if (!groupMap.has(variant.productId)) {
            groupMap.set(variant.productId, {
                productId: variant.productId,
                productName: variant.product.name,
                productDescription: variant.product.description,
                variants: [],
            })
        }
        groupMap.get(variant.productId)!.variants.push(variant)
    }

    const groups = Array.from(groupMap.values())

    return <VariantGroupList groups={groups} />
}

