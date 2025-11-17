import { NextRequest, NextResponse } from "next/server";
import cityData from "@/lib/city_names.json";

const MAX_RESULTS = 10;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const keyword = searchParams.get("keyword")?.toLowerCase().trim() || "";

        // If no keyword or keyword too short, return empty array
        if (!keyword || keyword.length < 2) {
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
            });
        }

        const filteredData: string[] = [];
        const seenCities = new Set<string>(); // Track unique cities
        const keywordLower = keyword.toLowerCase();

        // Optimize: Stop early when we have enough results
        // Prioritize cities that start with the keyword
        for (let i = 0; i < cityData.length && filteredData.length < MAX_RESULTS; i++) {
            const city = cityData[i];
            const cityLower = city.toLowerCase();

            if (cityLower.startsWith(keywordLower) && !seenCities.has(city)) {
                filteredData.push(city);
                seenCities.add(city);
            }
        }

        // If we still need more results, add cities that contain the keyword
        if (filteredData.length < MAX_RESULTS) {
            for (let i = 0; i < cityData.length && filteredData.length < MAX_RESULTS; i++) {
                const city = cityData[i];
                const cityLower = city.toLowerCase();

                if (!cityLower.startsWith(keywordLower) && cityLower.includes(keywordLower) && !seenCities.has(city)) {
                    filteredData.push(city);
                    seenCities.add(city);
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: filteredData,
            count: filteredData.length,
        });
    } catch (error) {
        console.error("Error fetching city data:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch city data",
            },
            { status: 500 }
        );
    }
}
