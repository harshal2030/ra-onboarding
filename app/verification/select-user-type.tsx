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
        <>
            {/* Main Content + Bottom Bar */}
            <div className="flex flex-col flex-1">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <form className="p-6">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="select-user-type-type-of-investor">
                                    Type of Investor
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                    defaultValue={userType}
                                    onValueChange={(v) => setUserType(v)}
                                    required
                                >
                                    <SelectTrigger id="select-user-type-type-of-investor">
                                        <SelectValue placeholder="MM" />
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
                                <FieldLabel htmlFor="select-user-type-pan-no">
                                    PAN No.
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    id="select-user-type-pan-no"
                                    required
                                    onChange={(e) => setPanNo(e.target.value)}
                                />
                            </Field>
                        </FieldGroup>
                    </form>
                </div>
                {/* Static Bottom Bar */}
                <div className="border-t p-4 bg-white sticky bottom-0">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            © IndoThai
                        </span>
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button
                                        className="px-6 py-1 rounded cursor-pointer"
                                        disabled={
                                            loading || !userType || !panNo
                                        }
                                    >
                                        {loading ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            "Verify and Next"
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogTitle>Verify</DialogTitle>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h4 className="text-xs text-gray-600">
                                                Type of Investor
                                            </h4>
                                            <p className="text-xs">
                                                {userType}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs text-gray-600">
                                                PAN Number
                                            </h4>
                                            <p className="text-xs tracking-wide">
                                                {panNo}
                                            </p>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                onClick={handleVerify}
                                            >
                                                Verify
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    );
};
