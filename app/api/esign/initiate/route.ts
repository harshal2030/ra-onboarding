import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leegalityService } from "@/lib/leegality";
import { EsignStatus, Gender } from "@/lib/generated/prisma/enums";
import { z } from "zod";
import { checkAndUpdateEsignStatusOfTheDocument } from "../checkAndUpdate";

const calculateAge = (dateOfBirth: Date | null): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
};

const userESignSchema = z.object({
    current_step: z.number(),
});

export async function POST(req: Request) {
    const user = req.headers.get("x-user");
    const body = await req.json();

    const parseResult = userESignSchema.safeParse(body);
    if (!parseResult.success) {
        console.log(parseResult.error);
        const errorTree = z.treeifyError(parseResult.error);
        return NextResponse.json(
            { success: false, error: errorTree },
            { status: 400 },
        );
    }

    const data = parseResult.data;

    if (!user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    try {
        const userData = await prisma.user.findFirst({
            where: {
                phone: user,
            },
        });

        if (!userData) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 },
            );
        }

        if (!userData.firstName || !userData.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User profile incomplete. Please complete your profile before signing the agreement.",
                },
                { status: 400 },
            );
        }

        if (userData.esignDocumentId) {
            const status = await checkAndUpdateEsignStatusOfTheDocument(
                userData.esignDocumentId,
            );
            if (status.code === "ESIGN_SUCCESS") {
                return NextResponse.json(
                    {
                        success: true,
                        message: "Document already signed",
                    },
                    { status: 200 },
                );
            } else if (status.signUrl) {
                return NextResponse.json({
                    success: true,
                    message: "E-sign already initiated",
                    data: {
                        signing_url: status.signUrl,
                        document_id: userData.esignDocumentId,
                    },
                });
            }
        }

        const templateData = {
            firstName: userData.firstName || "",
            middleName: userData.middleName || "",
            lastName: userData.lastName || "",
            fullName:
                `${userData.firstName || ""} ${userData.middleName || ""} ${userData.lastName || ""}`.trim(),
            email: userData.email || "",
            phone: userData.phone || "",
            panNo: userData.pan_no || "",
            address: userData.address || "",
            city: userData.city || "",
            dob: userData.dateOfBirth
                ? new Date(userData.dateOfBirth).toLocaleDateString("en-IN")
                : "",
            age: userData.dateOfBirth ? calculateAge(userData.dateOfBirth) : 0,
            gender: userData.gender || "",
            pronouns: userData.gender === Gender.MALE ? "him" : "her",
            nationality: userData.nationality || "",
            fatherSpouseName: userData.nameOfFatherOrSpouse || "",
            userType: userData.type || "",
            sourceOfIncome: userData.sourceOfIncome || "",
            residentialStatus: userData.residentialStatus || "",
            maritalStatus: userData.maritalStatus || "",
            politicalExpose: userData.politicalExpose || "",
            countryOfTax: userData.countryOfTax || "",
        };

        const documentName = `Agreement_${userData.firstName}_${userData.lastName}_${Date.now()}`;

        const result = await leegalityService.initiateESign(
            documentName,
            {
                name: templateData.fullName,
                email: userData.email,
                phone: userData.phone,
            },
            templateData.fullName,
            templateData.age,
            templateData.address,
            templateData.pronouns,
        );

        if (!result.success) {
            console.error("Failed to initiate e-sign:", result);
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to initiate e-sign",
                },
                { status: 500 },
            );
        }

        await prisma.user.update({
            where: {
                phone: user,
            },
            data: {
                esignDocumentId: result.data?.document_id,
                esignStatus: EsignStatus.INITIATED,
            },
        });

        return NextResponse.json({
            success: true,
            message: "E-sign initiated successfully",
            data: {
                signing_url: result.data?.signing_url,
                document_id: result.data?.document_id,
            },
        });
    } catch (error: any) {
        console.error("Error in /api/esign/initiate:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Something went wrong while initiating e-sign",
            },
            { status: 500 },
        );
    }
}
