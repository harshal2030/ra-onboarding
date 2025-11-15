"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoaderCircle, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const router = useRouter();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const sendOtpHandler = async (isResend = false) => {
        setLoading(true);
        try {
            const res = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(
                    isResend
                        ? "OTP resent successfully"
                        : data.message || "OTP send to your phone number",
                );
                setCounter(data.exp ? Number(data.exp) * 60 : 5 * 60);
                setStep(2);
            } else {
                toast.error(data.error || "Try again later");
            }
        } catch {
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    const verifyOtpHandler = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/verification");
                toast.success(data.message || "Successfully verified!");
            } else {
                setOtp("");
                toast.error(data.error || "Invalid OTP!");
            }
        } catch {
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
            {/* Header */}
            <header className="w-full py-6 px-8 bg-white/80 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <Shield className="w-7 h-7 text-blue-600" />
                    <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                        IndoThai Securities
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-linear-to-br from-blue-600 to-blue-700 px-8 py-8 text-white">
                            <div className="flex items-center justify-between mb-2">
                                {step === 2 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-1 text-blue-100 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="text-sm">Back</span>
                                    </button>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">
                                {step === 1 ? "Welcome" : "Verify OTP"}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {step === 1
                                    ? "Enter your phone number to get started"
                                    : `We've sent a verification code to +91 ${phone}`}
                            </p>
                        </div>

                        {/* Card Body */}
                        <div className="px-8 py-8">
                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                                +91
                                            </span>
                                            <Input
                                                type="number"
                                                minLength={10}
                                                maxLength={10}
                                                placeholder="Enter 10-digit mobile number"
                                                value={phone}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                className="pl-14 h-12 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => sendOtpHandler(false)}
                                        disabled={
                                            loading || phone.length !== 10
                                        }
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-lg transition-colors"
                                    >
                                        {loading ? (
                                            <LoaderCircle className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </Button>

                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-xs text-slate-500 text-center">
                                            By continuing, you agree to our
                                            Terms of Service and Privacy Policy
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-medium text-slate-700 block text-center">
                                            Enter Verification Code
                                        </label>
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                pattern={REGEXP_ONLY_DIGITS}
                                                value={otp}
                                                onChange={(value) =>
                                                    setOtp(value)
                                                }
                                                disabled={loading}
                                            >
                                                <InputOTPGroup className="gap-3">
                                                    <InputOTPSlot
                                                        index={0}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={1}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={2}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={3}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={4}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                    <InputOTPSlot
                                                        index={5}
                                                        className="w-12 h-14 text-lg border-slate-300 rounded-lg"
                                                    />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={verifyOtpHandler}
                                        disabled={loading || otp.length !== 6}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-lg transition-colors"
                                    >
                                        {loading ? (
                                            <LoaderCircle className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Verify & Continue"
                                        )}
                                    </Button>

                                    <div className="text-center space-y-3">
                                        {counter > 0 ? (
                                            <p className="text-sm text-slate-600">
                                                Resend code in{" "}
                                                <span className="font-semibold text-blue-600">
                                                    {formatTime(counter)}
                                                </span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    sendOtpHandler(true)
                                                }
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                Resend verification code
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        Secure client onboarding powered by IndoThai Securities
                    </p>
                </div>
            </div>
        </div>
    );
}
