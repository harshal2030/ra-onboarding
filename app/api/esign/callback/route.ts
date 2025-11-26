import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAndUpdateEsignStatusOfTheDocument } from "../checkAndUpdate";

const callbackSchema = z.object({
    documentId: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("Received callback:", body);

        const parseResult = callbackSchema.safeParse(body);
        if (!parseResult.success) {
            console.error("Invalid callback payload:", parseResult.error);
            return NextResponse.json(
                { success: false, error: "Invalid payload" },
                { status: 400 },
            );
        }

        await checkAndUpdateEsignStatusOfTheDocument(
            parseResult.data.documentId,
        );

        return NextResponse.json({
            success: true,
            message: "Callback received",
        });
    } catch (error: any) {
        console.error("Error in /api/esign/callback:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong processing the callback",
            },
            { status: 500 },
        );
    }
}
