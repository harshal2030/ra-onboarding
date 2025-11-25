"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  FileSignature } from "lucide-react";

export const KycEsign = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");


    const handleSignAgreement = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/esign/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                     current_step: 5,
                }),
            });

            const result = await response.json();

            if (result.success && result.data?.signing_url) {
                // Redirect to Leegality signing URL
                window.location.href = result.data.signing_url;
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
                                onClick={handleSignAgreement}
                                disabled={loading}
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
                                    onClick={handleSignAgreement}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
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
                    {/*<VerifyDialog
                        disabled={loading}
                        data={[
                            {
                                label: "Agreement Status",
                                value: true
                                    ? "Loaded"
                                    : "Not Available",
                            },
                        ]}
                        handleVerify={() => {}}
                        loading={loading}
                        title="Verify Your Details"
                    />*/}
                </div>
            </div>
        </div>
    );
};
