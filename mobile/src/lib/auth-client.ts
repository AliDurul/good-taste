import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: "http://10.0.2.2:8000", // Just the origin
    basePath: "/api/v1/auth", // Path separately
    plugins: [
        expoClient({
            scheme: "goodpocket",
            storagePrefix: "goodpocket",
            cookiePrefix: "goodtaste", // or "__Secure-goodtaste"
            storage: SecureStore,
        })
    ]
});