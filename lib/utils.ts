import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generatePhoneOtpVerifyMessage(
    otp: string,
    otpExpireMin: number,
): string {
    return `Your OTP is ${otp}. Use this to verify your mobile number for IndoThai RA Services Onboarding. Valid for ${otpExpireMin} minuts Regards IndoThai`;
}
