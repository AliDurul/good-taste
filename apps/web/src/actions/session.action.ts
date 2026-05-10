'use server';
import { cookies } from 'next/headers'

const BASE_URL = process.env.API_BASE_URL! || "http://localhost:8001/api/v1";

export const getSession = async () => {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    const res = await fetch(`${BASE_URL}/auth/get-session`, {
        headers: {
            cookie: cookieHeader
        },
        cache: "no-store"
    });

    if (!res.ok) return null
    return res.json();
}