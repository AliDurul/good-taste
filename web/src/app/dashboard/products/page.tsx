import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getProducts } from '@/actions/queries';
import ProductTable from './_components/ProductTable';
import { IPageSearchParams } from '@/types';

export default function page({ searchParams }: IPageSearchParams) {
    return (

        <div className='rounded-md border'>
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                       Good Taste Products
                    </h2>
                    <p className="text-muted-foreground">
                        A list of all the products in Good Taste. You can search, filter, and sort the products to find specific information. Use the actions menu to view more details about each product.
                    </p>
                </div>
                <DataSection label="products">
                    <Products searchParams={searchParams} />
                </DataSection>
            </div>
        </div>
    )
}

async function Products({searchParams}: IPageSearchParams) {

    const params = await searchParams;

    const result = await getProducts(params);

    if (result.data.length === 0) {
        return <div>No result found.</div>
    }

    return (
        <ProductTable result={result} />
    )
}
