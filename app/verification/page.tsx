"use client";

import { Button } from "@/components/ui/button";
import { useStepper } from "@/hooks/useStepper";
import { LogOut } from "lucide-react";

enum Steps {
    DISCLAIMER = "Disclaimer",
    SELECT_USER_TYPE = "Select User Type",
    CLIENT_BASIC_DETAILS = "Client Basic Details",
    CLIENT_PROFILE = "Client Profile",
    KYC_ESIGN = "Kyc E-Sign",
}
const steps: Steps[] = [
    Steps.DISCLAIMER,
    Steps.SELECT_USER_TYPE,
    Steps.CLIENT_BASIC_DETAILS,
    Steps.CLIENT_PROFILE,
    Steps.KYC_ESIGN,
];

export default function Verification() {
    const { currentStep } = useStepper(steps);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="h-[60px] border-b bg-white shadow-sm flex items-center justify-between px-6">
                <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
                    Client Onboarding
                </h1>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </Button>
            </header>

            {/* Main content */}

            <main className="flex flex-1 h-screen overflow-hidden">
                {/* Main Content + Bottom Bar */}
                <div className="flex flex-col flex-1">
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-gray-100 rounded"
                                >
                                    Content Block {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Static Bottom Bar */}
                    <div className="border-t p-4 bg-white sticky bottom-0">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                © IndoThai
                            </span>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded">
                                Action
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[200px] border-l flex flex-col items-center justify-between py-4 bg-gray-50">
                    <span>🏠</span>
                    <span>⚙️</span>
                </div>
            </main>
        </div>
    );
}
