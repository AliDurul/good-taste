import { getCategories } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { ProductForm } from '../_components/ProductForm'
import { IPageSearchParams } from '@/types'

export default function NewProductPage({ searchParams }: IPageSearchParams) {

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
          <FormData searchParams={searchParams} />
        </DataSection>
      </div>
    </div>
  )
}

async function FormData({ searchParams }: IPageSearchParams) {
  const [result, params] = await Promise.all([getCategories(), searchParams])
  const categoryId = params.categoryId

  return (
    <ProductForm
      mode="create"
      categories={result.data ?? []}
      defaultValues={categoryId ? { categoryId } : undefined}
    />
  )
}




