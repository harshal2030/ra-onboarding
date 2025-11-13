"use client";

import { Button } from "@/components/ui/button";
import { useStepper } from "@/hooks/useStepper";
import { LogOut } from "lucide-react";
import { Disclaimer } from "./disclaimer";
import { SelectUserType } from "./select-user-type";
import { ClientBasicDetails } from "./client-basic-details";
import { ClientProfile } from "./client-profile";
import { KycEsign } from "./kyc-esign";

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
    const { currentStep, currentIndex, nextStep } = useStepper(steps);

    const handleVerify = () => {
        nextStep();
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="h-[60px] border-b bg-white shadow-sm flex items-center justify-between px-6">
                <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
                    {currentStep}
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
                        {currentStep === Steps.DISCLAIMER && <Disclaimer />}
                        {currentStep === Steps.SELECT_USER_TYPE && (
                            <SelectUserType />
                        )}
                        {currentStep === Steps.CLIENT_BASIC_DETAILS && (
                            <ClientBasicDetails />
                        )}
                        {currentStep === Steps.CLIENT_PROFILE && (
                            <ClientProfile />
                        )}
                        {currentStep === Steps.KYC_ESIGN && <KycEsign />}
                    </div>

                    {/* Static Bottom Bar */}
                    <div className="border-t p-4 bg-white sticky bottom-0">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                © IndoThai
                            </span>
                            <Button
                                className="px-6 py-1 rounded cursor-pointer"
                                onClick={() => handleVerify()}
                            >
                                Verify
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-[220px] border-l flex flex-col py-5 px-4 gap-2 bg-gray-50 shadow-inner">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Steps
                    </h3>

                    {steps.map((step, i) => {
                        return (
                            <div
                                key={i}
                                className={`group relative flex flex-row items-center justify-between px-3 py-2 rounded-lg border border-gray-200 ${i <= currentIndex ? "bg-green-50 border-green-300" : "bg-white border-gray-200"} transition-all duration-200`}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-5 h-5 flex items-center justify-center text-[11px] font-medium ${i <= currentIndex ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700"} rounded-full`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-xs text-gray-700">
                                        {step}
                                    </span>
                                </div>

                                <button
                                    className={`hidden cursor-pointer ${i < currentIndex ? "group-hover:block" : ""} absolute right-2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-md transition-opacity duration-200`}
                                >
                                    Edit
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
