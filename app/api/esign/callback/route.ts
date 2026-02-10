import { NextResponse } from "next/server";
import { z } from "zod";
import { checkAndUpdateEsignStatusOfTheDocument } from "../checkAndUpdate";
import { saveBase64ToFile } from "@/lib/file";

import { EMAIL_HTML_TEMPLATE, transporter } from '@/lib/mail';
import { MAIL_SENDER_NAME } from "@/constants/config";

const callbackSchema = z.object({
    documentId: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parseResult = callbackSchema.safeParse(body);
        if (!parseResult.success) {
            console.error("Invalid callback payload:", parseResult.error);
            return NextResponse.json(
                { success: false, error: "Invalid payload" },
                { status: 400 },
            );
        }

        const files: string[] = body?.files || [];

        if (files.length > 0) {
            const file = files.at(-1);

            const filePath = await saveBase64ToFile(file!, `signed_document_${parseResult.data.documentId}.pdf`);
            const email = body.request.email || "";

            await transporter.sendMail({
                from: `${MAIL_SENDER_NAME} <${process.env.MAIL_SENDER_EMAIL}>`,
                to: email,
                subject: "Onboarding Completed – Research Analyst Services",
                html: EMAIL_HTML_TEMPLATE,
                attachments: [
                    {
                        filename: `signed_document_${parseResult.data.documentId}.pdf`,
                        path: filePath,
                    },
                ],
            });
        }

        await checkAndUpdateEsignStatusOfTheDocument(
            parseResult.data.documentId,
        );

        return NextResponse.json({
            success: true,
            message: "Callback received",
        });
    } catch (error: unknown) {
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
