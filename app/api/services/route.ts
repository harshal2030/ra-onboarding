import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: { annualFee: "asc" },
        });

        return NextResponse.json({ success: true, data: services });
    } catch (error) {
        console.error("Error in /api/services:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch services" },
            { status: 500 },
        );
    }
}
