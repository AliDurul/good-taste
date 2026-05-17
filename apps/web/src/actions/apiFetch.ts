import { ApiError } from "@/lib/error"
import type { ActionResult } from "@workspace/schemas"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export type FetchParams = Record<string, string | number | boolean | undefined | null>

export interface ApiFetchOptions extends RequestInit {
    params?: FetchParams
}

export async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {}

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Secure-goodtaste.session_token')?.value

    const query = params
        ? '?' + new URLSearchParams(
            Object.entries(params)
                .filter(([, v]) => v != null && v !== '')
                .map(([k, v]) => [k, String(v)])
          ).toString()
        : ''

    const res = await fetch(`${API_URL}${endpoint}${query}`, {
        ...fetchOptions,
        headers: {
            ...fetchOptions?.headers,
            "Content-Type": "application/json",
            ...(sessionCookie && { Cookie: `__Secure-goodtaste.session_token=${sessionCookie}` }),
        },
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new ApiError(error.message || "API Error", res.status)
    }

    return res.json() as Promise<T>
}

/**
 * Safe variant for mutation server actions — never throws.
 * Do NOT use inside `'use cache'` functions (errors would be cached).
 */
export async function safeApiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<ActionResult<T>> {
    try {
        const data = await apiFetch<T>(endpoint, options)
        return { success: true, data }
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, message: err.message, status: err.status }
        }
        return { success: false, message: "Unexpected error", status: 0 }
    }
}

// // Usage
// export const getProducts = () => fetchApi("/api/products")
// export const createProduct = (data: any) =>
//     fetchApi("/api/products", { method: "POST", body: JSON.stringify(data) })