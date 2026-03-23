import { LoaderCircle } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";

export const VerifyDialog = ({
    title,
    loading,
    handleVerify,
    data,
    disabled,
    verifyBtnText = "Verify and Next",
    cancelBtnText = "Cancel",
    mainBtnText = "Verify and Next",
    description,
    children,
}: {
    title: string;
    disabled: boolean;
    loading: boolean;
    handleVerify: () => void;
    data?: {
        label: string;
        value: string;
    }[];
    verifyBtnText?: string;
    cancelBtnText?: string;
    mainBtnText?: string;
    description?: string;
    children?: ReactNode;
}) => {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button
                        className="px-6 py-1 rounded cursor-pointer"
                        disabled={loading || disabled}
                    >
                        {loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            mainBtnText
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>{title}</DialogTitle>
                    {description ?? (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                    {children ? (
                        children
                    ) : (
                        <div className="space-y-4">
                            {data?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center border-b pb-2"
                                >
                                    <h4 className="text-xs text-gray-600">
                                        {item.label}
                                    </h4>
                                    <p className="text-xs">
                                        {item.value ? item.value : "-"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={loading} variant="outline">
                                {cancelBtnText}
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                disabled={loading}
                                onClick={handleVerify}
                            >
                                {verifyBtnText}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};
