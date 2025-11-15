import { VerifyDialog } from "@/components/custom/verify";

export const KycEsign = () => {
    return (
        <>
            {/* Main Content + Bottom Bar */}
            <div className="flex flex-col flex-1">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">Verification</div>
                {/* Static Bottom Bar */}
                <div className="border-t p-4 bg-white sticky bottom-0">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            © IndoThai
                        </span>
                        <VerifyDialog
                            disabled={false}
                            data={[
                                {
                                    label: "sample",
                                    value: "-",
                                },
                            ]}
                            handleVerify={() => {}}
                            loading={false}
                            title="Verify Your Details"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
