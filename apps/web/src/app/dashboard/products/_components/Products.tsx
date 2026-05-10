import { getProducts } from '@/actions/queries'
import React from 'react'

export default async function Products() {
    const products = await getProducts();

    if(!products) {
        return <div>No products found.</div>
    }

  return (
    <div>
      <h1>worked</h1>
    </div>
  )
}
