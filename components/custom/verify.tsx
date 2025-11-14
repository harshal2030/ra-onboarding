import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
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
}: {
    title: string;
    disabled: boolean;
    loading: boolean;
    handleVerify: () => void;
    data: {
        label: string;
        value: string;
    }[];
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
                            "Verify and Next"
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>{title}</DialogTitle>
                    <div className="space-y-4">
                        {data.map((item, index) => (
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={loading} variant="outline">
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
    );
};
