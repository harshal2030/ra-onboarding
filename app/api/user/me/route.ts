import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const user = req.headers.get("x-user");

    const data = await prisma.user.findFirst({
        where: {
            phone: user || "",
        },
    });

    if (!data) {
        return NextResponse.json(
            { status: false, error: "User not found" },
            { status: 404 },
        );
    }

    return NextResponse.json({
        status: true,
        data: {
            id: data.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            userType: data.type,
            currentStep: data.currentStep,
            createdAt: data.createdAt,
        },
    });
}
