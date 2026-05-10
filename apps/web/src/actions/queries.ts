'use server'
import { cacheLife, cacheTag } from 'next/cache'
import type { PaginatedResponse } from '@workspace/schemas'

// import type { UserStats, Order, UserProfile } from './types'
import { apiFetch } from './apiFetch'

// Per-user cached stats — revalidates every minute, expires after 5 min
export async function getProducts() {
  'use cache: private'
  cacheTag('products')
  cacheLife('weeks')

  return apiFetch<PaginatedResponse<Product>>('/products')
}

// // Per-user cached orders — short stale time since orders change often
// export async function getRecentOrders() {
//   'use cache: private'
//   cacheTag('orders')
//   cacheLife({ stale: 15, revalidate: 30, expire: 120 })

//   return apiFetch<Order[]>('/orders?limit=5')
// }

// // Per-user profile — longer cache, changes rarely
// export async function getUserProfile() {
//   'use cache: private'
//   cacheTag('user-profile')
//   cacheLife('hours')

//   return apiFetch<UserProfile>('/users/me')
// }

// // Shared/public data — not per-user, use regular 'use cache'
// export async function getAnnouncements() {
//   'use cache'
//   cacheTag('announcements')
//   cacheLife('minutes')

//   return apiFetch<Announcement[]>('/announcements')
// }

type Product = {
  id: string;
  name: string;
  isActive: boolean;
  price: number;
  pointsValue: number;
  stockQty: number;
  lowStockThreshold: number;
  categoryId: string;
  description?: string | undefined;
  images?: string[] | undefined;
  lastReStockDate?: Date | undefined;
}