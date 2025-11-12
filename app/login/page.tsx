"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoaderCircle } from "lucide-react";
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
        return `${m}m ${s}s`;
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
        <div className="h-screen flex justify-center items-center">
            <div className="w-[220px] flex flex-col justify-center gap-3">
                <h4 className="text-center">
                    Welcome to <span>IndoThai</span>
                </h4>
                {step == 1 ? (
                    <>
                        <Input
                            type="number"
                            minLength={10}
                            maxLength={10}
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                            onClick={() => sendOtpHandler(false)}
                            disabled={loading || phone.length != 10}
                            className="cursor-pointer"
                        >
                            {loading ? <LoaderCircle /> : "Send OTP"}
                        </Button>
                    </>
                ) : (
                    <>
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={otp}
                            onChange={(value) => setOtp(value)}
                            disabled={loading}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button
                            onClick={verifyOtpHandler}
                            disabled={loading || otp.length != 6}
                            className="cursor-pointer"
                        >
                            {loading ? <LoaderCircle /> : "Verify"}
                        </Button>
                        <div className="text-center mt-2 text-sm">
                            {counter > 0 ? (
                                <p className="text-gray-500">
                                    Resend OTP in <b>{formatTime(counter)}</b>
                                </p>
                            ) : (
                                <button
                                    onClick={() => sendOtpHandler(true)}
                                    className="text-blue-500 underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
