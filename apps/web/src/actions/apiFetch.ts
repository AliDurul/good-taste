import { ApiError } from "@/lib/error"
import type { ActionResult } from "@workspace/schemas"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export type FetchParams = Record<string, string | number | boolean | undefined | null>

export interface ApiFetchOptions extends RequestInit {
    params?: FetchParams
}

// Reads cookie — call this OUTSIDE 'use cache' boundaries
export async function getSessionToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('__Secure-goodtaste.session_token')?.value
}

export async function apiFetch<T>(endpoint: string, sessionToken: string | undefined, options?: ApiFetchOptions): Promise<{success: boolean} & T> {
    const { params, ...fetchOptions } = options ?? {}

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
            ...(sessionToken && { Cookie: `__Secure-goodtaste.session_token=${sessionToken}` }),
        },
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new ApiError(error.message || "API Error", res.status)
    }

    if (res.status === 204) {
        return { success: true } as { success: boolean } & T
    }

    return res.json() as Promise<{success: boolean} & T>
}


export async function safeApiFetch<T>(endpoint: string, sessionToken: string | undefined, options?: ApiFetchOptions): Promise<ActionResult<T>> {
    try {
        const data = await apiFetch<T>(endpoint, sessionToken, options)
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