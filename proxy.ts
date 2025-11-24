import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function proxy(req: Request) {
    const token = (await cookies()).get("token")?.value;
    const user = await verifyToken(token || "");

    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log(user);
    const requestHeaders = new Headers(req.headers);

    if (user.phone && typeof user.phone === "string")
        requestHeaders.set("x-user", user.phone);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// Apply middleware only to specific routes
export const config = {
    matcher: ["/api/user/:path*", "/api/agreement"],
};
