'use server';

import { cookies } from "next/headers";

const API_URL = process.env.API_URL!

async function getAuthHeaders() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('__Secure-goodtaste.session_token')?.value


    return {
        'Content-Type': 'application/json',
        ...(sessionCookie && { Cookie: `__Secure-goodtaste.session_token=${sessionCookie}` }),
    }
}