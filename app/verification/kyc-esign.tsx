"use client";

import { VerifyDialog } from "@/components/custom/verify";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSignature } from "lucide-react";

export const KycEsign = () => {
    const [agreementHtml, setAgreementHtml] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchAgreement();
    }, []);

    const fetchAgreement = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/agreement");
            const result = await response.json();

            if (result.status) {
                setAgreementHtml(result.data.html);
            } else {
                setError(result.error || "Failed to load agreement");
            }
        } catch (err) {
            setError("Failed to fetch agreement");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            // Create a blob from the HTML content
            const blob = new Blob([agreementHtml], { type: "text/html" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "agreement.html";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading PDF:", err);
            alert("Failed to download agreement");
        }
    };

    const handleSignAgreement = () => {
        // TODO: Implement e-sign functionality
        console.log("Sign agreement clicked");
        alert("E-Sign functionality to be implemented");
    };

    return (
        <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 px-8 py-6 overflow-auto">
                {/* Content Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                KYC & E-Sign Agreement
                            </h2>
                            <p className="text-sm text-slate-600">
                                Review and sign your agreement
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleDownloadPDF}
                                disabled={loading || !agreementHtml}
                                variant="outline"
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                            <Button
                                onClick={handleSignAgreement}
                                disabled={loading || !agreementHtml}
                                className="gap-2"
                            >
                                <FileSignature className="h-4 w-4" />
                                Sign Agreement
                            </Button>
                        </div>
                    </div>

                    {loading && (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
                                <p className="text-slate-600">
                                    Loading agreement...
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="min-h-[200px] flex items-center justify-center">
                            <div className="text-center text-red-600">
                                <p>{error}</p>
                                <Button
                                    onClick={fetchAgreement}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && agreementHtml && (
                        <>
                            <style
                                dangerouslySetInnerHTML={{
                                    __html: `
                                        .agreement-container {
                                            min-height: 100%;
                                            background: #f8f9fa;
                                            padding: 20px;
                                        }
                                        .agreement-container .awpage {
                                            margin: 20px auto !important;
                                            background: white;
                                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                        }
                                    `,
                                }}
                            />
                            <div className="border border-slate-200 rounded-lg bg-slate-50 max-h-[calc(100vh-250px)] overflow-auto">
                                <div
                                    className="agreement-container"
                                    dangerouslySetInnerHTML={{
                                        __html: agreementHtml,
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Static Bottom Bar */}
            <div className="flex-none border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        © IndoThai Securities
                    </span>
                    <VerifyDialog
                        disabled={loading || !agreementHtml}
                        data={[
                            {
                                label: "Agreement Status",
                                value: agreementHtml
                                    ? "Loaded"
                                    : "Not Available",
                            },
                        ]}
                        handleVerify={() => {}}
                        loading={loading}
                        title="Verify Your Details"
                    />
                </div>
            </div>
        </div>
    );
};
