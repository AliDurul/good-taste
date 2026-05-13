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


---


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

 Based on your configuration with `basePath: "/api/v1/auth"`, here are all the default routes Better Auth provides:

## Core Authentication Routes (Email/Password)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/sign-up/email` | Register new user with email/password |
| `POST` | `/api/v1/auth/sign-in/email` | Sign in with email/password |
| `POST` | `/api/v1/auth/sign-out` | Sign out current user |

## Session Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/auth/session` | Get current session |
| `GET` | `/api/v1/auth/session/list` | List all active sessions |
| `POST` | `/api/v1/auth/session/revoke` | Revoke a specific session |
| `POST` | `/api/v1/auth/session/remove-all` | Remove all sessions |

## Social OAuth Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/sign-in/social` | Initiate social sign-in |
| `GET` | `/api/v1/auth/callback/:provider` | OAuth callback (e.g., `/callback/google`, `/callback/facebook`) |

## Email Verification Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/send-verification-email` | Send verification email |
| `GET` | `/api/v1/auth/verify-email` | Verify email with token |

## Password Management Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/forget-password` | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Reset password with token |
| `POST` | `/api/v1/auth/change-password` | Change password (authenticated) |
| `POST` | `/api/v1/auth/update-user` | Update user info |

## User Account Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/auth/account` | Get current user info |
| `POST` | `/api/v1/auth/account/link` | Link social account |
| `POST` | `/api/v1/auth/account/unlink` | Unlink social account |
| `GET` | `/api/v1/auth/accounts` | List linked accounts |
| `POST` | `/api/v1/auth/delete-user` | Delete user account |

## Admin Plugin Routes (from your config)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/auth/admin/list-users` | List all users |
| `POST` | `/api/v1/auth/admin/set-role` | Set user role |
| `POST` | `/api/v1/auth/admin/create-user` | Create user |
| `POST` | `/api/v1/auth/admin/ban-user` | Ban/unban user |
| `POST` | `/api/v1/auth/admin/impersonate` | Impersonate user |
| `POST` | `/api/v1/auth/admin/stop-impersonating` | Stop impersonation |

## Bearer Plugin Routes (from your config)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/auth/token` | Get bearer token from session |

## Full Route List

To see all available routes in your app, you can:

1. **Programmatically access them:**
```ts
import { auth } from "./auth";

// Get all registered endpoints
const routes = auth.api.getEndpoints();
console.log(routes);
```

2. **Enable the OpenAPI plugin** (add to your plugins array):
```ts
import { openAPI } from "better-auth/plugins";

plugins: [
    // ... your other plugins
    openAPI(), // adds /api/v1/auth/reference with interactive docs
]
```

Then visit `/api/v1/auth/reference` to see all endpoints with their schemas and test them interactively.