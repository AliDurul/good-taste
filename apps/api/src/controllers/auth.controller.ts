import { RequestHandler } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const signUp: RequestHandler = async (req, res) => {
    const { name, email, password } = req.validatedBody;

    const { headers } = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        },
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    });

    // for development
    const authToken = headers.get("set-auth-token");

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, authToken, message: 'Sign up successful' });
};

export const signIn: RequestHandler = async (req, res) => {
    const { email, password } = req.validatedBody;
    const { headers } = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    });

    // for development
    const authToken = headers.get("set-auth-token");

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, authToken, message: 'Sign in successful' });
};

export const signOut: RequestHandler = async (req, res) => {
    const { headers } = await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
        returnHeaders: true,
    });

    // Forward cookies to the client
    const cookies = headers.getSetCookie();
    cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));

    res.status(200).send({ success: true, message: 'Sign out successful' });
};