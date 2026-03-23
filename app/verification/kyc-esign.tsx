"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {  FileSignature } from "lucide-react";

export const KycEsign = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [alreadySigned, setAlreadySigned] = useState(false);
    const [signingUrl, setSigningUrl] = useState<string>("");

    useEffect(() => {
        handleSignAgreement();
    }, []);

    const handleSignAgreement = async () => {
        try {
            setLoading(true);
            setError("");
            setAlreadySigned(false);
            setSigningUrl("");

            const response = await fetch("/api/esign/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    current_step: 6,
                }),
            });

            const result = await response.json();

            if (result.success && result.data?.signing_url) {
                // Store the signing URL instead of redirecting
                setSigningUrl(result.data.signing_url);
            } else if (result.success) {
                // User has already signed the document
                setAlreadySigned(true);
            } else {
                setError(
                    result.error ||
                        "Failed to initiate e-sign. Please try again."
                );
            }
        } catch (err) {
            console.error("Error initiating e-sign:", err);
            setError("An error occurred while initiating e-sign. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const proceedToSigning = () => {
        if (signingUrl) {
            window.location.href = signingUrl;
        }
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
                        {!alreadySigned && !signingUrl && (
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSignAgreement}
                                    disabled={loading}
                                    className="gap-2"
                                >
                                    <FileSignature className="h-4 w-4" />
                                    Initiate E-Sign
                                </Button>
                            </div>
                        )}
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
                                    onClick={handleSignAgreement}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {signingUrl && !alreadySigned && (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FileSignature className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                                    Agreement Ready to Sign
                                </h3>
                                <p className="text-slate-600 mb-6">
                                    Your e-sign agreement has been prepared and is ready for your signature.
                                </p>
                                <Button
                                    onClick={proceedToSigning}
                                    size="lg"
                                    className="gap-2"
                                >
                                    <FileSignature className="h-5 w-5" />
                                    Proceed to Complete E-Sign
                                </Button>
                            </div>
                        </div>
                    )}

                    {alreadySigned && (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg
                                        className="h-10 w-10 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                                    Successfully Onboarded!
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    You have already signed the agreement and completed the onboarding process.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Static Bottom Bar */}
            <div className="flex-none border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        © IndoThai Securities
                    </span>
                </div>
            </div>
        </div>
    );
};
