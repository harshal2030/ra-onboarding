import { prisma } from "@/lib/db";
import { EsignStatus, OnboardingStatus } from "@/lib/generated/prisma";
import { leegalityService } from "@/lib/leegality";

export const checkAndUpdateEsignStatusOfTheDocument = async (
    documentId: string,
): Promise<{
    success: boolean;
    signUrl?: string;
    code: "USER_NOT_FOUND" | "ESIGN_SUCCESS" | "ESIGN_INPROGRESS";
}> => {
    const userData = await prisma.user.findFirst({
        where: {
            esignDocumentId: documentId,
        },
    });

    if (!userData) {
        console.error(`User not found for document_id: ${documentId}`);
        return { success: false, code: "USER_NOT_FOUND" };
    }

    const status = await leegalityService.getDocumentStatus(
        userData.esignDocumentId ?? "",
    );

    if (status.data?.signed) {
        if (userData.esignStatus !== EsignStatus.COMPLETED) {
            await prisma.user.update({
                where: { id: userData.id },
                data: {
                    esignStatus: EsignStatus.COMPLETED,
                    esignCompletedAt: new Date(),
                    onboardingStatus: OnboardingStatus.COMPLETED,
                    currentStep: userData.currentStep + 1,
                },
            });
        }


        console.log(
            `[E-Sign] Completed successfully for user: ${userData.phone}`,
        );

        return {
            success: true,
            signUrl: status.data?.signing_url,
            code: "ESIGN_SUCCESS",
        };
    }

    return {
        success: false,
        signUrl: status.data?.signing_url,
        code: "ESIGN_INPROGRESS",
    };
};
