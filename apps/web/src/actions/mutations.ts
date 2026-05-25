// actions/mutations.ts
'use server'
import { ProductWithVariantsCreate, VariantCreate, VariantUpdate, WalletConfigUpdate, LoyaltyTierForm, CategoryCreate, CategoryUpdate, UserCreate, UserUpdate } from '@workspace/schemas'
import { apiFetch, getSessionToken } from './apiFetch'
import { updateTag } from 'next/cache'


export async function createProduct(data: ProductWithVariantsCreate) {
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
    productId: string,
    data: ProductWithVariantsCreate,
    originalVariantIds: string[]
): Promise<{ success: boolean; message: string }> {
    const token = await getSessionToken()
    try {
        const { variants, ...productFields } = data

        // 1. Update product-level fields
        await apiFetch(`/products/${productId}`, token, {
            method: 'PUT',
            body: JSON.stringify(productFields),
        })

        // 2. Delete variants that were removed
        const submittedExistingIds = new Set(variants.map(v => v.id).filter((id): id is string => !!id))
        const toDelete = originalVariantIds.filter(id => !submittedExistingIds.has(id))
        await Promise.all(toDelete.map(id => apiFetch(`/variants/${id}`, token, { method: 'DELETE' })))

        // 3. Update existing variants
        const existingVariants = variants.filter((v): v is typeof v & { id: string } => !!v.id)
        await Promise.all(existingVariants.map(({ id, ...variantData }) =>
            apiFetch(`/variants/${id}`, token, { method: 'PUT', body: JSON.stringify(variantData) })
        ))

        // 4. Create new variants
        const newVariants = variants.filter(v => !v.id)
        await Promise.all(newVariants.map(variantData =>
            apiFetch('/variants', token, { method: 'POST', body: JSON.stringify({ ...variantData, productId }) })
        ))

        updateTag('products')
        updateTag('variants')
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

