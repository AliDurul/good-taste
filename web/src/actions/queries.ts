'use server'
import { cacheLife, cacheTag } from 'next/cache'
import type { ActionResult, IDashboardStats, IOrder, IOrdersReport, IProduct, ISalesReport, IWalletConfig, ILoyaltyTier, PaginatedResponse, IProductCategory, IUser } from '@/types'
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

export async function getUsers(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchUsers(token, params)
}

export async function getAgents(): Promise<PaginatedResponse<IUser> & { success: boolean }> {
  const token = await getSessionToken()
  try {
    return await fetchUsers(token, { roles: 'agent', limit: 200 })
  } catch {
    return {
      success: true,
      data: [],
      pagination: { page: 1, limit: 200, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    }
  }
}

// Orders are created from the mobile app too, outside this app's updateTag()
// reach — so no 'use cache' here: always fetch fresh.
export async function getOrders(params?: FetchParams) {
  const token = await getSessionToken()
  return apiFetch<PaginatedResponse<IOrder>>('/orders', token, { params })
}

export async function getOrder(id: string): Promise<ActionResult<IOrder>> {
  const token = await getSessionToken()
  try {
    const res = await apiFetch<{ success: true; data: IOrder }>(`/orders/${id}`, token)
    return { success: true, data: res.data }
  } catch {
    return { success: false, message: 'Order not found', status: 404 }
  }
}

export async function getCustomers(): Promise<PaginatedResponse<IUser> & { success: boolean }> {
  const token = await getSessionToken()
  try {
    return await fetchUsers(token, { roles: 'customer', limit: 200 })
  } catch {
    return {
      success: true,
      data: [],
      pagination: { page: 1, limit: 200, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    }
  }
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

// Analytics — orders also come from the mobile app, outside this app's
// updateTag() reach — so no 'use cache': always fetch fresh.
export async function getDashboardStats() {
  const token = await getSessionToken()
  return apiFetch<{ success: true; data: IDashboardStats }>('/analytics/dashboard', token)
}

export async function getSalesReport(params?: FetchParams) {
  const token = await getSessionToken()
  return apiFetch<{ success: true; data: ISalesReport }>('/analytics/sales', token, { params })
}

export async function getOrdersReport(params?: FetchParams) {
  const token = await getSessionToken()
  return apiFetch<{ success: true; data: IOrdersReport }>('/analytics/orders', token, { params })
}