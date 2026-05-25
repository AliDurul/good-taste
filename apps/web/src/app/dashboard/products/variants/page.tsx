import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getProducts } from '@/actions/queries'
import { VariantGroupList } from './_components/VariantGroupList'

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
    const result = await getProducts({ limit: '500' })

    if (result.data.length === 0) {
        return <div>No result found.</div>
    }

    return <VariantGroupList groups={result.data} />
}

