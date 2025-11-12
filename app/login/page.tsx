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
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Login() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [exp, setExp] = useState(5);
    const router = useRouter();

    const sendOtpHandler = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message || "OTP send to your phone number");
                if (data.exp && typeof data.exp === "number") {
                    setExp(data.exp);
                }
                setStep(2);
            } else {
                toast.error(data.error || "Try after sometime");
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
                            onClick={sendOtpHandler}
                            disabled={loading || phone.length != 10}
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
                        >
                            {loading ? <LoaderCircle /> : "Verify"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
