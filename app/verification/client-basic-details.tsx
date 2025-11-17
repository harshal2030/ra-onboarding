import { VerifyDialog } from "@/components/custom/verify";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Step } from "@/types/steps";
import { useState } from "react";
import toast from "react-hot-toast";

export const ClientBasicDetails = ({
    onComplete,
}: {
    onComplete: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    step: Step.CLIENT_BASIC_DETAILS,
                    data: {
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        email,
                        password,
                        current_step: 3,
                    },
                }),
            });

            if (res.ok) {
                toast.success("Basic details updated successfully!");
                onComplete();
            } else {
                const data = await res.json();
                if (process.env.NEXT_PUBLIC_ENV === "dev")
                    alert(JSON.stringify(data));
                toast.error("Failed to update basic details!");
            }
        } catch (error) {
            if (process.env.NEXT_PUBLIC_ENV === "dev")
                alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    return (
        <>
            {/* Main Content + Bottom Bar */}
            <div className="flex flex-col flex-1">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {/* Content Card */}
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                Basic Details
                            </h2>
                            <p className="text-sm text-slate-600">
                                Please provide your personal information
                            </p>
                        </div>
                        <form className="space-y-8">
                            {/* Full Name */}
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">
                                    Personal Information
                                </h3>
                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="first-name" className="text-sm font-medium text-slate-700">
                                            First Name
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="first-name"
                                            value={firstName}
                                            placeholder="Enter first name"
                                            required
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="middle-name" className="text-sm font-medium text-slate-700">
                                            Middle Name
                                        </FieldLabel>
                                        <Input
                                            id="middle-name"
                                            value={middleName}
                                            placeholder="Enter middle name"
                                            onChange={(e) =>
                                                setMiddleName(e.target.value)
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="last-name" className="text-sm font-medium text-slate-700">
                                            Last Name{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="last-name"
                                            value={lastName}
                                            placeholder="Enter last name"
                                            required
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>

                            {/* Email */}
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">
                                    Contact Information
                                </h3>

                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-sm font-medium text-slate-700">
                                            Email{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            value={email}
                                            placeholder="Enter email address"
                                            required
                                            type="email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>

                            {/* Passwords */}
                            <div className="space-y-4">
                                <h3 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">
                                    Security
                                </h3>

                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password" className="text-sm font-medium text-slate-700">
                                            Password{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            placeholder="Enter password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
                                            Confirm Password{" "}
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            placeholder="Confirm password"
                                            required
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Static Bottom Bar */}
                <div className="border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm sticky bottom-0 shadow-lg">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <span className="text-sm text-slate-500">
                            © IndoThai Securities
                        </span>
                        <VerifyDialog
                            disabled={
                                !firstName ||
                                !lastName ||
                                !email ||
                                !password ||
                                !confirmPassword ||
                                password !== confirmPassword
                            }
                            data={[
                                {
                                    label: "firstName",
                                    value: firstName,
                                },
                                {
                                    label: "middleName",
                                    value: middleName,
                                },
                                {
                                    label: "lastName",
                                    value: lastName,
                                },
                                {
                                    label: "email",
                                    value: email,
                                },
                            ]}
                            handleVerify={handleVerify}
                            loading={loading}
                            title="Verify Your Details"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
