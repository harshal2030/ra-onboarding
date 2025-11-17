import { VerifyDialog } from "@/components/custom/verify";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserType } from "@/lib/generated/prisma/enums";
import { Step } from "@/types/steps";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const SelectUserType = ({ onComplete }: { onComplete: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<string>(UserType.INDIVIDUAL);
    const [panNo, setPanNo] = useState("");

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    step: Step.SELECT_USER_TYPE,
                    data: {
                        user_type: userType,
                        pan_no: panNo,
                        current_step: 2,
                    },
                }),
            });

            if (res.ok) {
                toast.success("User type updated successfully!");
                onComplete();
            }
        } catch (error) {
            if (process.env.ENV === "dev") alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 px-8 py-6">
                {/* Content Card */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            Investor Information
                        </h2>
                        <p className="text-sm text-slate-600">
                            Please provide your basic details to continue
                        </p>
                    </div>
                    <form className="space-y-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel
                                    htmlFor="select-user-type-type-of-investor"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Type of Investor
                                    <span className="text-red-500 ml-1">*</span>
                                </FieldLabel>
                                <Select
                                    defaultValue={userType}
                                    onValueChange={(v) => setUserType(v)}
                                    required
                                >
                                    <SelectTrigger
                                        id="select-user-type-type-of-investor"
                                        className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <SelectValue placeholder="Select investor type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserType.INDIVIDUAL}>
                                            Individual
                                        </SelectItem>
                                        <SelectItem value={UserType.HUF}>
                                            HUF
                                        </SelectItem>
                                        <SelectItem value={UserType.CORPORATE}>
                                            Corporate
                                        </SelectItem>
                                        <SelectItem value={UserType.LLP}>
                                            LLP
                                        </SelectItem>
                                        <SelectItem value={UserType.TRUST}>
                                            Trust
                                        </SelectItem>
                                        <SelectItem
                                            value={UserType.PARTNERSHIP_FIRM}
                                        >
                                            Partnership Firm
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel
                                    htmlFor="select-user-type-pan-no"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    PAN No.
                                    <span className="text-red-500 ml-1">*</span>
                                </FieldLabel>
                                <Input
                                    id="select-user-type-pan-no"
                                    placeholder="Enter PAN number"
                                    required
                                    onChange={(e) => setPanNo(e.target.value)}
                                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
            </div>
            {/* Static Bottom Bar */}
            <div className="flex-none border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        © IndoThai Securities
                    </span>
                    <VerifyDialog
                        disabled={loading || !userType || !panNo}
                        data={[
                            {
                                label: "Investor Type",
                                value: userType,
                            },
                            {
                                label: "Pan No",
                                value: panNo,
                            },
                        ]}
                        handleVerify={handleVerify}
                        loading={loading}
                        title="Select User Type"
                        mainBtnText="Verify and Next"
                    />
                </div>
            </div>
        </div>
    );
};
