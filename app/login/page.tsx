"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

export default function Login() {
    const [verifyOtp, setVerifyOtp] = useState(false);
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-[220px] flex flex-col justify-center gap-3">
                <h4 className="text-center">
                    Welcome to <span>IndoThai</span>
                </h4>
                {verifyOtp ? (
                    <>
                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button onClick={() => setVerifyOtp(!verifyOtp)}>
                            Verify
                        </Button>
                    </>
                ) : (
                    <>
                        <Input
                            type="number"
                            placeholder="User Name / Mobile Number"
                            className="w-full text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button onClick={() => setVerifyOtp(!verifyOtp)}>
                            Next
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
