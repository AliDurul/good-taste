import React, { Suspense } from 'react'
import { SectionErrorBoundary } from '@/components/SectionErrorFallback'
import { getProducts } from '@/actions/queries';

export default function page() {
    return (
        <div>
            <h1>Products</h1>
            <SectionErrorBoundary label="products">
                <Suspense fallback={<div>Loading products...</div>}>
                    <Products />
                </Suspense>
            </SectionErrorBoundary>
        </div>
    )
}

async function Products() {
    const products = await getProducts();

    if (!products) {
        return <div>No products found.</div>
    }

    return (
        <div>
            <h1>worked</h1>
        </div>
    )
}
