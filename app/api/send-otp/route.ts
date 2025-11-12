import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePhoneOtpVerifyMessage } from "@/lib/utils";

const otpExpireMin = process.env.OTP_EXPIRE_MIN || 5;

export async function POST(req: Request) {
    try {
        const { phone }: { phone: string } = await req.json();
        if (!phone || phone.length != 10) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid phone number",
                },
                { status: 400 },
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const message = generatePhoneOtpVerifyMessage(otp, otpExpireMin);

        // TODO: Send message on phone
        console.log(`${phone}: ${message}`);

        await prisma.user.upsert({
            where: { phone },
            update: {
                otp,
                otpExpire: new Date(Date.now() + otpExpireMin * 60 * 1000),
            },
            create: {
                phone,
                otp,
                otpExpire: new Date(Date.now() + otpExpireMin * 60 * 1000),
            },
        });

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
            exp: otpExpireMin,
        });
    } catch (error: any) {
        console.error("Error in /api/send-otp:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong, try after sometime!",
            },
            { status: 500 },
        );
    }
}
