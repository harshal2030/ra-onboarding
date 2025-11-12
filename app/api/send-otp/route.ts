import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const { phone } = await req.json();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.upsert({
        where: { phone },
        update: { otp, otpExpire: new Date(Date.now() + 5 * 60 * 1000) },
        create: { phone, otp, otpExpire: new Date(Date.now() + 5 * 60 * 1000) },
    });

    console.log(`OTP for ${phone}: ${otp}`);
    return NextResponse.json({ success: true, message: "OTP sent" });
}
