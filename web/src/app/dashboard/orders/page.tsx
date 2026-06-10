import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getOrders } from '@/actions/queries';
import OrderTable from './_components/OrderTable';
import { IPageSearchParams } from '@/types';

export default function page({ searchParams }: IPageSearchParams) {
    return (
        <div className='rounded-md border'>
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Orders
                    </h2>
                    <p className="text-muted-foreground">
                        All Good Taste orders. Confirm pending orders, mark them delivered to generate the customer&apos;s QR code, and track payment and status at a glance.
                    </p>
                </div>
                <DataSection label="orders">
                    <Orders searchParams={searchParams} />
                </DataSection>
            </div>
        </div>
    )
}

async function Orders({ searchParams }: IPageSearchParams) {
    const params = await searchParams;
    const result = await getOrders(params);

    return (
        <OrderTable result={result} />
    )
}
