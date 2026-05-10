import { adminClient, inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:8000",
    basePath: "/api/v1/auth",
    plugins: [
        adminClient(),
        inferAdditionalFields({
            user: {
                role: { type: "string" as const },
                banned: { type: "boolean" as const },
                banReason: { type: "string" as const },
                banExpires: { type: "date" as const }
            }
        })
    ]
});