import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json({ user: req.headers.get("x-user") });
}
