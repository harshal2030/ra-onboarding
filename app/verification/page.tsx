"use client";

import { Button } from "@/components/ui/button";
import { useStepper } from "@/hooks/useStepper";
import { LoaderCircle, LogOut } from "lucide-react";
import Image from "next/image";
import { Disclaimer } from "./disclaimer";
import { SelectUserType } from "./select-user-type";
import { ClientBasicDetails } from "./client-basic-details";
import { ClientProfile } from "./client-profile";
import { KycEsign } from "./kyc-esign";
import { Step } from "@/types/steps";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "@/lib/generated/prisma/browser";

const steps: Step[] = [
    Step.DISCLAIMER,
    Step.SELECT_USER_TYPE,
    Step.CLIENT_BASIC_DETAILS,
    Step.CLIENT_PROFILE,
    Step.KYC_ESIGN,
];

export default function Verification() {
    const { currentStep, currentIndex, nextStep, goToStep } = useStepper(steps);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Partial<User | undefined>>(undefined);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        let active = true;

        (async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (active && data.data) setUser(data.data);
                    goToStep(
                        data.data.currentStep &&
                            typeof data.data.currentStep === "number"
                            ? data.data.currentStep - 1
                            : 0,
                    );
                }
            } catch (error) {
                if (process.env.ENV === "dev") alert(JSON.stringify(error));
                toast.error("Something went wrong, try after sometime!");
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const editPreviousStep = async (index: number) => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/me", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentStep: index + 1 }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.data)
                    goToStep(
                        data.data.currentStep &&
                            typeof data.data.currentStep === "number"
                            ? data.data.currentStep - 1
                            : 0,
                    );
            }
        } catch (error) {
            if (process.env.ENV === "dev") alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                toast.success("Logged out successfully!");
                window.location.href = "/login";
            } else {
                toast.error("Logout failed, please try again");
            }
        } catch (error) {
            if (process.env.ENV === "dev") alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex justify-center items-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex justify-center items-center">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <span className="text-slate-700">
                        Try after sometime, or contact support
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col overflow-hidden">
            {/* Header - Fixed */}
            <header className="flex-none w-full py-4 px-8 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="IndoThai Securities Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto"
                            priority
                        />
                        <div className="border-l border-slate-300 pl-4">
                            <p className="text-sm font-medium text-slate-600">
                                {currentStep}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className={`${loggingOut ? "cursor-not-allowed" : "cursor-pointer"} flex items-center gap-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors border-slate-300`}
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? (
                            <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                            <LogOut size={18} />
                        )}
                        <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex flex-1 overflow-hidden">
                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {currentStep === Step.DISCLAIMER && (
                        <Disclaimer onComplete={() => nextStep()} />
                    )}
                    {currentStep === Step.SELECT_USER_TYPE && (
                        <SelectUserType onComplete={() => nextStep()} />
                    )}
                    {currentStep === Step.CLIENT_BASIC_DETAILS && (
                        <ClientBasicDetails onComplete={() => nextStep()} />
                    )}
                    {currentStep === Step.CLIENT_PROFILE && (
                        <ClientProfile onComplete={() => nextStep()} />
                    )}
                    {currentStep === Step.KYC_ESIGN && <KycEsign />}
                </div>

                {/* Sidebar - Fixed */}
                <div className="flex-none w-[240px] border-l border-slate-200 flex flex-col py-6 px-5 gap-3 bg-white/80 backdrop-blur-sm shadow-sm overflow-y-auto">
                    <h3 className="text-sm font-semibold text-slate-800 mb-2 tracking-tight">
                        Progress
                    </h3>

                    {steps.map((step, i) => {
                        return (
                            <div
                                key={i}
                                className={`group relative flex flex-row items-center justify-between px-3 py-2.5 rounded-lg border ${i < currentIndex ? "bg-blue-50 border-blue-200" : i === currentIndex ? "bg-blue-100 border-blue-300" : "bg-white border-slate-200"} transition-all duration-200 shadow-sm`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className={`w-6 h-6 flex items-center justify-center text-xs font-semibold ${i < currentIndex ? "bg-blue-600 text-white" : i === currentIndex ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"} rounded-full`}
                                    >
                                        {i + 1}
                                    </span>
                                    <span
                                        className={`text-xs font-medium ${i <= currentIndex ? "text-slate-800" : "text-slate-500"}`}
                                    >
                                        {step}
                                    </span>
                                </div>

                                <button
                                    onClick={() => editPreviousStep(i)}
                                    className={`hidden cursor-pointer ${i < currentIndex ? "group-hover:block" : ""} absolute right-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-md transition-all duration-200 shadow-sm`}
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
