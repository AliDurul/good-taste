'use server'
import { cacheLife, cacheTag } from 'next/cache'
import type { ActionResult, IProduct, IWalletConfig, ILoyaltyTier, PaginatedResponse, IProductCategory, IProductVariantWithProduct, IUser } from '@workspace/schemas'
import { apiFetch, getSessionToken, type FetchParams } from './apiFetch'

async function fetchProducts(token: string | undefined, params?: FetchParams) {
  'use cache'
  cacheTag('products')
  cacheLife('weeks')
  return apiFetch<PaginatedResponse<IProduct>>('/products', token, { params })
}

async function fetchProduct(token: string | undefined, id: string) {
  'use cache'
  cacheTag('products')
  cacheLife('weeks')
  return apiFetch<{ success: true; data: IProduct }>(`/products/${id}`, token)
}

async function fetchCategories(token: string | undefined, params?: FetchParams) {
  'use cache'
  cacheTag('categories')
  cacheLife('weeks')
  return apiFetch<PaginatedResponse<IProductCategory>>('/categories', token, { params })
}

async function fetchWalletConfigs(token: string | undefined) {
  'use cache'
  cacheTag('wallet-configs')
  cacheLife('hours')
  return apiFetch<PaginatedResponse<IWalletConfig>>('/wallet-configs', token)
}

async function fetchLoyaltyTiers(token: string | undefined) {
  'use cache'
  cacheTag('loyalty-tiers')
  cacheLife('hours')
  return apiFetch<PaginatedResponse<ILoyaltyTier>>('/loyalty-tiers', token)
}

async function fetchVariants(token: string | undefined, params?: FetchParams) {
  'use cache'
  cacheTag('variants')
  cacheLife('minutes')
  return apiFetch<PaginatedResponse<IProductVariantWithProduct>>('/variants', token, { params })
}

async function fetchUsers(token: string | undefined, params?: FetchParams) {
  'use cache'
  cacheTag('users')
  cacheLife('weeks')
  return apiFetch<PaginatedResponse<IUser>>('/users', token, { params })
}

async function fetchUser(token: string | undefined, id: string) {
  'use cache'
  cacheTag('users')
  cacheLife('weeks')
  return apiFetch<{ success: true; data: IUser }>(`/users/${id}`, token)
}


// Public APIS

export async function getProducts(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchProducts(token, params)
}

export async function getProduct(id: string): Promise<ActionResult<IProduct>> {
  const token = await getSessionToken()
  try {
    const res = await fetchProduct(token, id)
    return { success: true, data: res.data }
  } catch {
    return { success: false, message: 'Product not found', status: 404 }
  }
}

export async function getCategories(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchCategories(token, params)
}

export async function getWalletConfigs() {
  const token = await getSessionToken()
  return fetchWalletConfigs(token)
}

export async function getLoyaltyTiers() {
  const token = await getSessionToken()
  return fetchLoyaltyTiers(token)
}

export async function getVariants(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchVariants(token, params)
}

export async function getUsers(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchUsers(token, params)
}

export async function getAgents() {
  const token = await getSessionToken()
  return fetchUsers(token, { roles: 'agent', limit: 200 })
}

export async function getUser(id: string): Promise<ActionResult<IUser>> {
  const token = await getSessionToken()
  try {
    const res = await fetchUser(token, id)
    return { success: true, data: res.data }
  } catch {
    return { success: false, message: 'User not found', status: 404 }
  }
}