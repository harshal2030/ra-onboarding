import { prisma } from "@/lib/db";
import { Step } from "@/types/steps";
import { NextResponse } from "next/server";
import { z } from "zod";

const userVerifyStepSchema = z.discriminatedUnion("step", [
    z.object({
        step: z.literal(Step.DISCLAIMER),
        data: z.object({
            agree: z.boolean().default(false),
            current_step: z.number(),
        }),
    }),
    z.object({
        step: z.literal(Step.SELECT_USER_TYPE),
        data: z.object({
            user_type: z.boolean().default(false),
            current_step: z.number(),
        }),
    }),
]);

export async function POST(req: Request) {
    try {
        const user = req.headers.get("x-user");
        const body = await req.json();

        console.log(`Received body: ${JSON.stringify(body)}`);

        const parseResult = userVerifyStepSchema.safeParse(body);
        if (!parseResult.success) {
            console.log(parseResult.error);
            const errorTree = z.treeifyError(parseResult.error);
            return NextResponse.json(
                { success: false, error: errorTree },
                { status: 400 },
            );
        }

        const data = parseResult.data;

        switch (data.step) {
            case Step.DISCLAIMER:
                if (data.data.agree) {
                    await prisma.user.update({
                        where: {
                            phone: user || "",
                            currentStep: data.data.current_step,
                        },
                        data: { currentStep: data.data.current_step + 1 },
                    });
                }
        }

        return NextResponse.json({
            success: true,
            message: "Step completed successfully!",
        });
    } catch (error) {
        console.error("Error in /api/user/verify:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong, try after sometime!",
            },
            { status: 500 },
        );
    }
}
