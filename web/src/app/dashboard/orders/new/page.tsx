import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getAgents, getCustomers, getProducts } from '@/actions/queries'
import { OrderForm } from '../_components/OrderForm'

export default function NewOrderPage() {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
                    <Link href="/dashboard/orders">
                        <ArrowLeft className="mr-1 size-4" />
                        Back to Orders
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Create Order</h2>
                    <p className="text-muted-foreground">
                        Place an order on behalf of a customer. Preview the totals to see discounts and loyalty points before creating it.
                    </p>
                </div>
                <Suspense fallback={<Skeleton className="h-96 w-full rounded-md" />}>
                    <NewOrder />
                </Suspense>
            </div>
        </div>
    )
}

async function NewOrder() {
    const [customers, agents, products] = await Promise.all([
        getCustomers(),
        getAgents(),
        getProducts({ limit: 200, isActive: true }),
    ])

    return (
        <OrderForm
            customers={customers.data}
            agents={agents.data}
            products={products.data}
        />
    )
}
