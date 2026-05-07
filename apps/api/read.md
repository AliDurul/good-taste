 Let me search for relevant information about handling auth across web and mobile apps with Better Auth. Your setup is on the right track, but there are important differences in how web and mobile apps should send requests. Your current middleware **will work** for both, but you'll need to handle the Expo client differently.

## How Each Client Should Send Requests

### 1. Web App (Browser)
Cookies work automatically with the browser. Your web frontend just needs to include `credentials: 'include'`:

```ts
// Web client - cookies sent automatically
fetch('/api/protected', {
  credentials: 'include' // Important!
});
```

The browser handles the session cookie automatically after sign-in.

### 2. Expo Mobile App
Mobile apps can't use browser cookies the same way. The `@better-auth/expo` client stores the session in `SecureStore`. When making requests to your backend, you must manually retrieve and send the cookie:

```tsx
import { authClient } from "@/lib/auth-client";

const makeAuthenticatedRequest = async () => {
  // Get the stored cookie from SecureStore
  const cookies = authClient.getCookie();
  
  const response = await fetch("http://your-api.com/api/protected", { 
    headers: {
      "Cookie": cookies, // Manually attach the session cookie
    },
    credentials: "omit" // Don't interfere with manual cookie
  });
  
  return response.json();
};
```

**Important**: The Expo integration docs specifically mention this pattern - you must use `authClient.getCookie()` to retrieve the session and manually set the `Cookie` header.

## Improving Your Middleware

Your middleware is mostly good, but there's one small improvement. The `auth.api.getSession()` already supports Bearer tokens automatically if the Bearer plugin is enabled. Here's an optimized version:

```ts
import type { NextFunction, Response, Request } from "express";
import { auth } from "../lib/auth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: new Headers(req.headers as any),
        });
        
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        if (session.user.banned) {
            return res.status(403).json({ error: "Account banned" });
        }
        
        req.user = session.user;
        next();
    } catch (e) {
        return res.status(401).json({ error: "Invalid session" });
    }
}
```

Your `auth.api.getSession()` already handles:
- ✅ Cookies from web apps
- ✅ Bearer tokens (if you add the Bearer plugin)
- ✅ Manually set Cookie headers from Expo

## Alternative: Bearer Token Approach

If you prefer a **unified approach** for both web and mobile, enable the Bearer plugin:

```ts
// auth.ts - Add Bearer plugin
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [bearer()],
    // ... rest of config
});
```

Then update your auth client to store and use the Bearer token:

```ts
// auth-client.ts (works for both web and mobile)
export const authClient = createAuthClient({
    baseURL: "http://localhost:8081",
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("bearer_token") || "" // Or SecureStore for mobile
        },
        onSuccess: (ctx) => {
            // Store token on sign-in
            const authToken = ctx.response.headers.get("set-auth-token");
            if (authToken) {
                localStorage.setItem("bearer_token", authToken);
                // For mobile: SecureStore.setItemAsync("bearer_token", authToken);
            }
        }
    }
});
```

With Bearer tokens, your backend stays the same - `auth.api.getSession()` handles both cookies and Bearer tokens automatically.

## Summary

| Platform | Auth Method | Header |
|----------|-------------|--------|
| Web | Cookies (automatic) | `Cookie: session=...` |
| Expo | SecureStore → Cookie header | `Cookie: better-auth.session=...` |
| Either | Bearer token | `Authorization: Bearer ...` |

Your current middleware **is suitable** - just ensure:
1. **Web**: Use `credentials: 'include'` in fetch requests
2. **Expo**: Use `authClient.getCookie()` and manually set the `Cookie` header
3. **CORS**: Ensure your Express server allows credentials from your frontend origins

If you want the simplest cross-platform experience, add the Bearer plugin and use tokens instead of juggling cookies.






----

   **Yes!** You can absolutely test Better Auth without a frontend. There are two main approaches:

## Option 1: Built-in Open API Reference (Recommended)

Better Auth has an **Open API plugin** that gives you an interactive testing interface:

### Setup

```ts
// auth.ts
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins"; // Add this

export const auth = betterAuth({
    plugins: [
        openAPI(), // Interactive API docs
        admin(),   // Your other plugins
    ]
});
```

### Usage

Navigate to: `http://localhost:3000/api/auth/reference`

You'll get a **Scalar OpenAPI interface** where you can:
- ✅ See all available endpoints
- ✅ View request/response schemas
- ✅ Test endpoints directly in the browser
- ✅ See all authenticated endpoints from your plugins

<img src="/images/docs/open-api-reference.png" width="600" />

---

## Option 2: Postman / REST Client

Since Better Auth exposes standard REST endpoints, you can test with any HTTP client.

### Key Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/sign-in/email` | POST | Sign in with email/password | ❌ |
| `/api/auth/sign-up/email` | POST | Register new user | ❌ |
| `/api/auth/sign-out` | POST | Sign out | ✅ |
| `/api/auth/session` | GET | Get current session | ✅ |
| `/api/auth/admin/list-users` | GET | List all users (admin) | ✅ Admin |

### Testing Workflow in Postman/REST Client

#### 1. Sign Up / Sign In

```http
### Sign In
POST http://localhost:3000/api/auth/sign-in/email
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Headers:**
```http
set-cookie: better-auth.session=eyJhbGc...; Path=/; HttpOnly; Secure
set-auth-token: your-bearer-token-here  # If using Bearer plugin
```

#### 2. Use Session Cookie for Authenticated Requests

**Option A: Cookie (default)**
Copy the `better-auth.session` cookie from the sign-in response and add to subsequent requests:

```http
### Get User Session
GET http://localhost:3000/api/auth/session
Cookie: better-auth.session=eyJhbGc...

### Admin: List Users
GET http://localhost:3000/api/auth/admin/list-users?limit=50
Cookie: better-auth.session=eyJhbGc...
```

**Option B: Bearer Token (if using Bearer plugin)**
```http
GET http://localhost:3000/api/auth/admin/list-users
Authorization: Bearer your-bearer-token-here
```

#### 3. Full Admin API Example (REST Client file)

Create a `test.http` file in VS Code:

```http
@baseUrl = http://localhost:3000
@contentType = application/json

### 1. Sign in as admin
# @name login
POST {{baseUrl}}/api/auth/sign-in/email
Content-Type: {{contentType}}

{
  "email": "admin@example.com",
  "password": "admin123"
}

### 2. Store session cookie (manually copy from response)
# After login, copy the set-cookie header value

### 3. List all users (Admin)
GET {{baseUrl}}/api/auth/admin/list-users?limit=50
Cookie: better-auth.session=PASTE_COOKIE_HERE

### 4. Get specific user (Admin)
GET {{baseUrl}}/api/auth/admin/get-user?id=user-id-here
Cookie: better-auth.session=PASTE_COOKIE_HERE

### 5. Create new user (Admin)
POST {{baseUrl}}/api/auth/admin/create-user
Content-Type: {{contentType}}
Cookie: better-auth.session=PASTE_COOKIE_HERE

{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "New User",
  "role": "user"
}

### 6. Ban user (Admin)
POST {{baseUrl}}/api/auth/admin/ban-user
Content-Type: {{contentType}}
Cookie: better-auth.session=PASTE_COOKIE_HERE

{
  "userId": "user-id-to-ban",
  "banReason": "Spam",
  "banExpiresIn": 86400
}

### 7. Set user role (Admin)
POST {{baseUrl}}/api/auth/admin/set-role
Content-Type: {{contentType}}
Cookie: better-auth.session=PASTE_COOKIE_HERE

{
  "userId": "user-id-here",
  "role": "admin"
}

### 8. Sign out
POST {{baseUrl}}/api/auth/sign-out
Cookie: better-auth.session=PASTE_COOKIE_HERE
```

---

## Getting All Endpoints for Postman

### Option A: OpenAPI Schema Export

```ts
// Add this route to get the full OpenAPI schema
app.get("/api/auth-schema", async (req, res) => {
    const schema = await auth.api.generateOpenAPISchema();
    res.json(schema);
});
```

Then import the JSON into Postman (Import → Paste Raw Text).

### Option B: List All Endpoints

```ts
// Debug: List all registered endpoints
console.log("Available endpoints:", Object.keys(auth.api));
```

---

## Quick Tip: Create an Admin User First

Before testing admin endpoints, create an admin user:

```ts
// One-time script: create-admin.ts
import { auth } from "./lib/auth";

async function createAdmin() {
    const user = await auth.api.signUpEmail({
        body: {
            email: "admin@example.com",
            password: "admin123",
            name: "Admin User",
        },
    });
    
    // Set as admin directly in DB or use setRole
    await auth.api.setRole({
        body: {
            userId: user.user.id,
            role: "admin",
        },
    });
    
    console.log("Admin created:", user.user.id);
}

createAdmin();
```

---

## Summary

| Tool | Best For | Setup |
|------|----------|-------|
| **Open API Plugin** | Quick testing, exploring endpoints, seeing schemas | Add `openAPI()` plugin, visit `/api/auth/reference` |
| **Postman** | Team collaboration, collections, environments | Import OpenAPI schema or create requests manually |
| **VS Code REST Client** | Quick tests during development, version-controlled tests | Create `.http` files |

The **Open API plugin** is the fastest way to start since it's interactive and shows all available endpoints automatically. Let me know if you need help setting up either option!