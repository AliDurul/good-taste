import { RequestHandler } from "express";
import { auth } from "../lib/auth";
import { getHeaders } from "../lib/common";
import { fromNodeHeaders } from "better-auth/node";

export const signUp: RequestHandler = async (req, res) => {
    const { name, email, password } = req.validatedBody;

    const { token, user } = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
    });

    res.status(200).send({ success: true, data: { token, user } });
};

export const signIn: RequestHandler = async (req, res) => {
    const { email, password } = req.validatedBody;
    const { headers } = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        headers: fromNodeHeaders(req.headers), // optional but recommended
        returnHeaders: true, // ⬅️ Capture headers
    });

    const authToken = headers.get("set-auth-token");

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, authToken, message: 'sign in successful' });
};

export const signOut: RequestHandler = async (req, res) => {
    await auth.api.signOut({
        headers: getHeaders(req),
    });
    res.status(200).send({ success: true });
};