import crypto from "crypto";

interface LeegalityEsignRequest {
    profileId: string;
    file: {
        name: string;
        file: string;
        fields: {
            id: string;
            name: string;
            type: string;
            value: string;
            required: boolean;
        }[];
        additionalFiles: string | null;
    };
    invitees: {
        email: string;
        name: string;
        phone: string;
    }[];
}

interface LeegalityResponse {
    success: boolean;
    data?: {
        document_id: string;
        signing_url: string;
        status: string;
        signed?: boolean;
    };
    error?: string;
    message?: string;
}

export class LeegalityService {
    private authToken: string;
    private privateSalt: string;
    private baseUrl: string;
    private workflowId: string;

    constructor() {
        this.authToken = process.env.LEEGALITY_AUTH_TOKEN || "";
        this.privateSalt = process.env.LEEGALITY_PRIVATE_SALT || "";
        this.baseUrl = process.env.LEEGALITY_BASE_URL || "";
        this.workflowId = process.env.LEEGALITY_WORKFLOW_ID || "";

        if (
            !this.authToken ||
            !this.privateSalt ||
            !this.baseUrl ||
            !this.workflowId
        ) {
            throw new Error(
                "Leegality environment variables are not properly configured",
            );
        }
    }

    private generateSignature(payload: string): string {
        return crypto
            .createHmac("sha256", this.privateSalt)
            .update(payload)
            .digest("hex");
    }

    async initiateESign(
        documentName: string,
        signerData: {
            name: string;
            email: string;
            phone: string;
        },
        client_name: string,
    ): Promise<LeegalityResponse> {
        try {
            const payload: LeegalityEsignRequest = {
                profileId: this.workflowId,
                file: {
                    name: documentName,
                    file: "",
                    fields: [
                        {
                            id: "1764047328467",
                            name: "client_name",
                            type: "text",
                            value: client_name,
                            required: true,
                        },
                        {
                            id: "1764047364750",
                            name: "client_name",
                            type: "text",
                            value: client_name,
                            required: true,
                        },
                    ],
                    additionalFiles: null,
                },
                invitees: [
                    {
                        name: signerData.name,
                        email: signerData.email,
                        phone: signerData.phone,
                    },
                ],
            };

            const payloadString = JSON.stringify(payload);

            const response = await fetch(`${this.baseUrl}/sign/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": this.authToken,
                },
                body: payloadString,
            });

            const data = await response.json();

            console.log(response);
            console.log(data);

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || "Failed to initiate e-sign",
                };
            }

            return {
                success: true,
                data: {
                    document_id: data.data.documentId,
                    signing_url: data.data.invitees?.[0]?.signUrl,
                    status: data.status,
                },
            };
        } catch (error: any) {
            console.error("Error initiating Leegality e-sign:", error);
            return {
                success: false,
                error:
                    error.message ||
                    "An error occurred while initiating e-sign",
            };
        }
    }

    async getDocumentStatus(documentId: string): Promise<LeegalityResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/sign/request?documentId=${documentId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Auth-Token": this.authToken,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || "Failed to fetch document status",
                };
            }

            return {
                success: true,
                data: {
                    document_id: data.data.document_id,
                    signing_url: data.data.requests[0].signUrl,
                    signed: data.data.requests[0].signed,
                    status: data.status,
                },
            };
        } catch (error: any) {
            console.error("Error fetching Leegality document status:", error);
            return {
                success: false,
                error:
                    error.message ||
                    "An error occurred while fetching document status",
            };
        }
    }
}

export const leegalityService = new LeegalityService();
