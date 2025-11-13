import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { phone, otp } = await req.json();
        if (!phone || phone.length != 10) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid phone number",
                },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({ where: { phone } });

        if (!user || user.otp !== otp || user.otpExpire! < new Date()) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        const token = await generateToken(phone);
        await setAuthCookie(token);

        await prisma.user.update({
            where: { phone },
            data: { otp: null, otpExpire: null },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error in /api/verify-otp:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong, try after sometime!",
            },
            { status: 500 },
        );
    }
}
