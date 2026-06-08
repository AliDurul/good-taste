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
