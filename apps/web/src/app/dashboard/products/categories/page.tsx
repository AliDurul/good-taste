import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getCategories } from '@/actions/queries';
import CategoryTable from './_components/CategoryTable';

export default function page({ searchParams }: IPageSearchParams) {
    return (

        <div className='rounded-md border'>
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                       Good Taste Categories
                    </h2>
                    <p className="text-muted-foreground">
                        A list of all the categories in Good Taste. You can search, filter, and sort the categories to find specific information. Use the actions menu to view more details about each category.
                    </p>
                </div>
                <DataSection label="categories">
                    <Categories searchParams={searchParams} />
                </DataSection>
            </div>
        </div>
    )
}

async function Categories({searchParams}: IPageSearchParams) {

    const params = await searchParams;

    const result = await getCategories(params);

    if (result.data.length === 0) {
        return <div>No result found.</div>
    }

    return (
        <CategoryTable result={result} />
    )
}
