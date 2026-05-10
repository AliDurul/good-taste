import { ApiError } from "@/lib/error"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL!

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Secure-goodtaste.session_token')?.value

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options?.headers,
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

// // Usage
// export const getProducts = () => fetchApi("/api/products")
// export const createProduct = (data: any) =>
//     fetchApi("/api/products", { method: "POST", body: JSON.stringify(data) })