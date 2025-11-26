import { prisma } from "@/lib/db";
import { OnboardingStatus, User } from "@/lib/generated/prisma/client";
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

export async function POST(req: Request) {
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

    const body = await req.json();
    const { email, firstName, lastName, type, currentStep } = body;

    const update: Partial<User> = {};
    if (email) update.email = email;
    if (firstName) update.firstName = firstName;
    if (lastName) update.lastName = lastName;
    if (type) update.type = type;
    if (currentStep) {
        update.currentStep = currentStep;
        update.esignStatus = null;
        update.esignDocumentId = null;
        update.esignCompletedAt = null;
        update.onboardingStatus = OnboardingStatus.IN_PROGRESS;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: data.id,
        },
        data: update,
    });

    return NextResponse.json({
        status: true,
        data: {
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.firstName,
            last_name: updatedUser.lastName,
            phone: updatedUser.phone,
            userType: updatedUser.type,
            currentStep: updatedUser.currentStep,
            createdAt: updatedUser.createdAt,
        },
    });
}
