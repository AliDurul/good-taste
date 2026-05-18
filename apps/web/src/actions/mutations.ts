// actions/mutations.ts
'use server'
import { IProduct, IWalletConfig, VariantCreate, VariantUpdate } from '@workspace/schemas'
import { apiFetch, getSessionToken } from './apiFetch'
import { updateTag } from 'next/cache'

export async function updateWalletConfig(id: string, data: Partial<IWalletConfig>) {
    const token = await getSessionToken()
    const result = await apiFetch(`/wallet-configs/${id}`, token, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    updateTag('wallet-configs') // ✅ all admins get fresh data
    return result
}

export async function createProduct(data: Partial<IProduct>) {
    const token = await getSessionToken()
    const result = await apiFetch('/products', token, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    updateTag('products')
    return result
}

// same pattern for any other mutation...

export async function createVariant(data: VariantCreate) {
    const token = await getSessionToken()
    const result = await apiFetch('/variants', token, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    updateTag('variants')
    return result
}

export async function updateVariant(id: string, data: VariantUpdate) {
    const token = await getSessionToken()
    const result = await apiFetch(`/variants/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    updateTag('variants')
    return result
}

export async function deleteVariant(id: string) {
    const token = await getSessionToken()
    const result = await apiFetch(`/variants/${id}`, token, { method: 'DELETE' })
    updateTag('variants')
    return result
}