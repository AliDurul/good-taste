import { authClient } from "@/lib/auth-client";


const getCookies = () => {
    return authClient.getCookie();
}

const RequestExp = async () => {
    const cookies = authClient.getCookie();
    const response = await fetch("https://your-api-domain.com/protected", {
        headers: { "Cookie": cookies },
        credentials: "omit" // important: don't use 'include' with manual cookies
    });
    return response.json();
};