import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { Gender } from "@/lib/generated/prisma/enums";

export async function GET(req: Request) {
    const user = req.headers.get("x-user");

    if (!user) {
        return NextResponse.json(
            { status: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    const userData = await prisma.user.findFirst({
        where: {
            phone: user,
        },
    });

    if (!userData) {
        return NextResponse.json(
            { status: false, error: "User not found" },
            { status: 404 },
        );
    }

    try {
        // Read the Handlebars template
        const templatePath = path.join(
            process.cwd(),
            "templates",
            "agreement.hbs",
        );
        const templateSource = fs.readFileSync(templatePath, "utf-8");

        // Compile the template
        const template = Handlebars.compile(templateSource);

        // Calculate age from date of birth
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

        // Prepare data for the template
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

        // Generate the HTML
        const htmlContent = template(templateData);

        return NextResponse.json({
            status: true,
            data: {
                html: htmlContent,
                userData: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                },
            },
        });
    } catch (error) {
        console.error("Error generating agreement:", error);
        return NextResponse.json(
            { status: false, error: "Failed to generate agreement" },
            { status: 500 },
        );
    }
}
