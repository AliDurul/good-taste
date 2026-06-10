// actions/mutations.ts
'use server'
import { ProductCreate, ProductUpdate, WalletConfigUpdate, LoyaltyTierForm, CategoryCreate, CategoryUpdate, UserCreate, UserUpdate, OrderCreateForm, OrderPreview, OrderUpdate } from '@/schemas'
import { apiFetch, getSessionToken, safeApiFetch } from './apiFetch'
import type { ActionResult, IDeliverOrderData, IOrder, IOrderPreviewData } from '@/types'
import { ApiError } from '@/lib/error'
import { updateTag } from 'next/cache'


export async function createProduct(data: ProductCreate) {
    const token = await getSessionToken()
    const result = await apiFetch<{ success: boolean }>('/products', token, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    updateTag('products')
    return result
}

export async function updateWalletConfig(
    id: string,
    data: WalletConfigUpdate
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/wallet-configs/${id}`, token, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
        updateTag('wallet-configs')
        return { success: true, message: 'Configuration saved successfully.' }
    } catch {
        return { success: false, message: 'Failed to save configuration.' }
    }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/products/${id}`, token, { method: 'DELETE' })
        updateTag('products')
        return { success: true, message: 'Product deleted successfully.' }
    } catch {
        return { success: false, message: 'Failed to delete product.' }
    }
}

export async function updateProduct(
    id: string,
    data: ProductUpdate
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/products/${id}`, token, { method: 'PUT', body: JSON.stringify(data) })
        updateTag('products')
        return { success: true, message: 'Product updated successfully.' }
    } catch {
        return { success: false, message: 'Failed to update product.' }
    }
}

export async function createLoyaltyTier(
    data: LoyaltyTierForm
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch('/loyalty-tiers', token, {
            method: 'POST',
            body: JSON.stringify(data),
        })
        updateTag('loyalty-tiers')
        return { success: true, message: 'Tier created successfully.' }
    } catch {
        return { success: false, message: 'Failed to create tier.' }
    }
}

export async function updateLoyaltyTier(
    id: string,
    data: LoyaltyTierForm
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/loyalty-tiers/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        updateTag('loyalty-tiers')
        return { success: true, message: 'Tier updated successfully.' }
    } catch {
        return { success: false, message: 'Failed to update tier.' }
    }
}

export async function deleteLoyaltyTier(
    id: string
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        const res = await apiFetch(`/loyalty-tiers/${id}`, token, { method: 'DELETE' })
        console.log('Delete response:', res)

        updateTag('loyalty-tiers')
        return { success: true, message: 'Tier deleted successfully.' }
    } catch (error) {
        console.error('Failed to delete tier:', error)
        return { success: false, message: 'Failed to delete tier.' }
    }
}

export async function createUser(data: UserCreate & { image?: string }): Promise<{ success: boolean; message?: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch('/users', token, {
            method: 'POST',
            body: JSON.stringify(data),
        })
        updateTag('users')
        return { success: true }
    } catch {
        return { success: false, message: 'Failed to create user.' }
    }
}

export async function updateUser(
    id: string,
    data: UserUpdate
): Promise<{ success: boolean; message?: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/users/${id}`, token, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
        updateTag('users')
        return { success: true }
    } catch {
        return { success: false, message: 'Failed to update user.' }
    }
}

export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/users/${id}`, token, { method: 'DELETE' })
        updateTag('users')
        return { success: true, message: 'User deleted successfully.' }
    } catch {
        return { success: false, message: 'Failed to delete user.' }
    }
}

// ── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(data: OrderCreateForm): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    const result = await safeApiFetch<{ data: IOrder }>('/orders', token, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    if (!result.success) {
        return { success: false, message: result.message || 'Failed to create order.' }
    }
    updateTag('products') // stock decremented
    updateTag('users') // wallet balance may change
    return { success: true, message: 'Order created successfully.' }
}

export async function previewOrder(data: OrderPreview): Promise<ActionResult<IOrderPreviewData>> {
    const token = await getSessionToken()
    const result = await safeApiFetch<{ data: IOrderPreviewData }>('/orders/preview', token, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    if (!result.success) return result
    return { success: true, data: result.data.data }
}

export async function confirmOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    const result = await safeApiFetch(`/orders/${orderId}/confirm`, token, { method: 'PATCH' })
    if (!result.success) {
        return { success: false, message: result.message || 'Failed to confirm order.' }
    }
    return { success: true, message: 'Order confirmed.' }
}

export async function deliverOrder(orderId: string): Promise<ActionResult<IDeliverOrderData>> {
    const token = await getSessionToken()
    const result = await safeApiFetch<{ data: IDeliverOrderData }>(`/orders/${orderId}/deliver`, token, {
        method: 'PATCH',
    })
    if (!result.success) return result
    updateTag('users') // wallet may be credited later via QR scan
    return { success: true, data: result.data.data }
}

export async function updateOrder(id: string, data: OrderUpdate): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    const result = await safeApiFetch(`/orders/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
    if (!result.success) {
        return { success: false, message: result.message || 'Failed to update order.' }
    }
    if (data.status === 'cancelled') {
        updateTag('products') // stock restored
        updateTag('users') // redeemed wallet refunded
    }
    return { success: true, message: 'Order updated successfully.' }
}

export async function deleteOrder(id: string): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/orders/${id}`, token, { method: 'DELETE' })
    } catch (err) {
        // the API answers 204 with an empty body, which fails res.json() —
        // only a real ApiError means the delete itself failed
        if (err instanceof ApiError) {
            return { success: false, message: 'Failed to delete order.' }
        }
    }
    return { success: true, message: 'Order deleted successfully.' }
}

export async function createCategory(
    data: CategoryCreate
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch('/categories', token, { method: 'POST', body: JSON.stringify(data) })
        updateTag('categories')
        return { success: true, message: 'Category created successfully.' }
    } catch {
        return { success: false, message: 'Failed to create category.' }
    }
}

export async function updateCategory(
    id: string,
    data: CategoryUpdate
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/categories/${id}`, token, { method: 'PUT', body: JSON.stringify(data) })
        updateTag('categories')
        return { success: true, message: 'Category updated successfully.' }
    } catch {
        return { success: false, message: 'Failed to update category.' }
    }
}

export async function deleteCategory(
    id: string
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        await apiFetch(`/categories/${id}`, token, { method: 'DELETE' })
        updateTag('categories')
        return { success: true, message: 'Category deleted successfully.' }
    } catch {
        return { success: false, message: 'Failed to delete category.' }
    }
}

