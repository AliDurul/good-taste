'use server'
import { cacheLife, cacheTag } from 'next/cache'
import type { IProduct, IWalletConfig, ILoyaltyTier, PaginatedResponse, IProductCategory, IProductVariantWithProduct } from '@workspace/schemas'
import { apiFetch, getSessionToken, type FetchParams } from './apiFetch'

// Per-user cached stats — revalidates every minute, expires after 5 min
async function fetchProducts(token: string | undefined, params?: FetchParams) {
  'use cache'
  cacheTag('products')
  cacheLife('weeks')
  return apiFetch<PaginatedResponse<IProduct>>('/products', token, { params })
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


// Public APIS

export async function getProducts(params?: FetchParams) {
  const token = await getSessionToken()
  return fetchProducts(token, params)
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