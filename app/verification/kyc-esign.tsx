import { VerifyDialog } from "@/components/custom/verify";

export const KycEsign = () => {
    return (
        <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 px-8 py-6">
                {/* Content Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            KYC & E-Sign
                        </h2>
                        <p className="text-sm text-slate-600">
                            Complete your KYC verification and e-signature
                        </p>
                    </div>
                    <div className="min-h-[200px] flex items-center justify-center">
                        <p className="text-slate-600">Verification in progress...</p>
                    </div>
                </div>
            </div>
            {/* Static Bottom Bar */}
            <div className="flex-none border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        © IndoThai Securities
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
    );
};
