import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    basePath: "/api/v1/auth",
    plugins: [
        adminClient(),
        inferAdditionalFields({
            user: {
                phone: { type: "string" },
                address: { type: "string" },
                city: { type: "string" },
                country: { type: "string" },
                birthday: { type: "date" },
                referralCode: { type: "string" },
                walletBalance: { type: "number" },
                totalSpend: { type: "number" },
                assignedAgentId: { type: "string" },
                referredById: { type: "string" },
                tierId: { type: "string" },
                role: { type: "string" },
                banned: { type: "boolean" },
                banReason: { type: "string" },
                banExpires: { type: "date" }
            }
        })
    ]
});