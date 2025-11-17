import { NextRequest, NextResponse } from "next/server";
import nationalityData from "@/lib/nationality.json";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get("keyword")?.toLowerCase() || "";

        // If no keyword, return all nationalities
        if (!keyword) {
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
            });
        }

        // Filter nationalities based on keyword match in label
        const filteredData = nationalityData.filter((nationality) =>
            nationality.label.toLowerCase().includes(keyword),
        );

        return NextResponse.json({
            success: true,
            data: filteredData,
            count: filteredData.length,
        });
    } catch (error) {
        console.error("Error fetching nationality data:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch nationality data",
            },
            { status: 500 },
        );
    }
}
