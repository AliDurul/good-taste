import { getCategories } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { ProductForm } from '../_components/ProductForm'

export default function NewProductPage() {

  return (
    <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">New Product</h2>
        <p className="text-muted-foreground">
          Fill in the details below to add a new product to Good Taste.
        </p>
      </div>
      <div className="rounded-md border p-4">
        <DataSection label="product details">
          <FormData />
        </DataSection>
      </div>
    </div>
  )
}

async function FormData() {
  const result = await getCategories()

  return <ProductForm mode="create" categories={result.data ?? []} />
}




