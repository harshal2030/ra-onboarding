import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "supersecret",
);

export async function generateToken(phone: string) {
    return await new SignJWT({ phone })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(SECRET);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (e: any) {
        console.error("Token verification error:", e.message);
        return null;
    }
}

export async function setAuthCookie(token: string) {
    (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });
}

export async function clearAuthCookie() {
    (await cookies()).delete("token");
}
