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
                <div className="flex-1 overflow-y-auto p-4">
                    <Card className="p-6">
                        <form className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="first-name">
                                            First Name
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="first-name"
                                            value={firstName}
                                            required
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="middle-name">
                                            Middle Name
                                        </FieldLabel>
                                        <Input
                                            id="middle-name"
                                            value={middleName}
                                            onChange={(e) =>
                                                setMiddleName(e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="last-name">
                                            Last Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="last-name"
                                            value={lastName}
                                            required
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Contact
                                </h3>

                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            value={email}
                                            required
                                            type="email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>

                            {/* Passwords */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Security
                                </h3>

                                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            Password{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={confirmPassword}
                                            required
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Static Bottom Bar */}
                <div className="border-t p-4 bg-white sticky bottom-0">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            © IndoThai
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
