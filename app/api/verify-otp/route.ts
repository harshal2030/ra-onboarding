import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
    const { phone, otp } = await req.json();
    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || user.otp !== otp || user.otpExpire! < new Date()) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const token = generateToken(phone);
    await setAuthCookie(token);

    await prisma.user.update({
        where: { phone },
        data: { otp: null, otpExpire: null },
    });

    return NextResponse.json({ success: true });
}
