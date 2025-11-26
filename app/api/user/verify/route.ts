import { prisma } from "@/lib/db";
import {
    Gender,
    MaritalStatus,
    OnboardingStatus,
    PoliticalExpose,
    ResidentialStatus,
    SourceOfIncome,
    UserType,
} from "@/lib/generated/prisma/enums";
import { Step } from "@/types/steps";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
            user_type: z.string(),
            pan_no: z.string(),
            current_step: z.number(),
        }),
    }),
    z.object({
        step: z.literal(Step.CLIENT_BASIC_DETAILS),
        data: z.object({
            first_name: z.string(),
            middle_name: z.string().optional(),
            last_name: z.string(),
            email: z.email(),
            password: z.string(),
            current_step: z.number(),
        }),
    }),
    z.object({
        step: z.literal(Step.CLIENT_PROFILE),
        data: z.object({
            dob: z.coerce.date(),
            name_of_father_or_spouse: z.string(),
            source_of_income: z.enum(SourceOfIncome),
            nationality: z.string(),
            city: z.string(),
            address: z.string(),
            politically_expose: z.enum(PoliticalExpose),
            gender: z.enum(Gender),
            residential_status: z.enum(ResidentialStatus),
            marital_status: z.enum(MaritalStatus),
            current_step: z.number(),
        }),
    }),
]);

export async function POST(req: Request) {
    try {
        const user = req.headers.get("x-user");
        const body = await req.json();

        if (process.env.ENV != "prod") console.log(`[/api/user/verify POST] Received body: ${JSON.stringify(body)}`);

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
                        data: {
                            currentStep: data.data.current_step + 1,
                            onboardingStatus: OnboardingStatus.IN_PROGRESS,
                        },
                    });
                }
            case Step.SELECT_USER_TYPE:
                if (data.step === Step.SELECT_USER_TYPE) {
                    let type: UserType = UserType.INDIVIDUAL;

                    if (data.data.user_type === UserType.CORPORATE) {
                        type = UserType.CORPORATE;
                    } else if (data.data.user_type === UserType.HUF) {
                        type = UserType.HUF;
                    } else if (data.data.user_type === UserType.LLP) {
                        type = UserType.LLP;
                    } else if (
                        data.data.user_type === UserType.PARTNERSHIP_FIRM
                    ) {
                        type = UserType.PARTNERSHIP_FIRM;
                    } else if (data.data.user_type === UserType.TRUST) {
                        type = UserType.TRUST;
                    }
                    await prisma.user.update({
                        where: {
                            phone: user || "",
                            currentStep: data.data.current_step,
                        },
                        data: {
                            type,
                            pan_no: data.data.pan_no,
                            currentStep: data.data.current_step + 1,
                            onboardingStatus: OnboardingStatus.IN_PROGRESS,
                        },
                    });
                }
            case Step.CLIENT_BASIC_DETAILS:
                if (data.step === Step.CLIENT_BASIC_DETAILS) {
                    const hashedPassword = await bcrypt.hash(
                        data.data.password,
                        10,
                    );

                    await prisma.user.update({
                        where: {
                            phone: user || "",
                            currentStep: data.data.current_step,
                        },
                        data: {
                            firstName: data.data.first_name,
                            middleName: data.data.middle_name ?? null,
                            lastName: data.data.last_name,
                            email: data.data.email,
                            passwordHash: hashedPassword,
                            currentStep: data.data.current_step + 1,
                            onboardingStatus: OnboardingStatus.IN_PROGRESS,
                        },
                    });
                }
            case Step.CLIENT_PROFILE:
                if (data.step === Step.CLIENT_PROFILE) {
                    await prisma.user.update({
                        where: {
                            phone: user || "",
                        },
                        data: {
                            dateOfBirth: data.data.dob,
                            nameOfFatherOrSpouse:
                                data.data.name_of_father_or_spouse,
                            sourceOfIncome: data.data.source_of_income,
                            nationality: data.data.nationality,
                            city: data.data.city,
                            address: data.data.address,
                            politicalExpose: data.data.politically_expose,
                            gender: data.data.gender,
                            residentialStatus: data.data.residential_status,
                            maritalStatus: data.data.marital_status,

                            currentStep: data.data.current_step + 1,
                            onboardingStatus: OnboardingStatus.IN_PROGRESS,
                        },
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
