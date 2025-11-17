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
import { Step } from "@/types/steps";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const Disclaimer = ({ onComplete }: { onComplete: () => void }) => {
    const [loading, setLoading] = useState(false);

    const agreeHandler = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    step: Step.DISCLAIMER,
                    data: {
                        agree: true,
                        current_step: 1,
                    },
                }),
            });

            if (res.ok) {
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
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 relative">
                    {/* Content Card */}
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-4">
                        <p className="text-sm font-semibold text-slate-900 mb-3">
                            Dear Investor,
                        </p>

                        <p className="text-sm text-slate-700 leading-relaxed">
                            Clients financial risk tolerance - attitudes, values,
                            motivations, preferences and experiences, is measured
                            with a risk profile. The risk profile questionnaire
                            helps in understanding the risk tolerance level as well
                            as time horizon in investing. The questionnaire is
                            designed to show which type of investment approach may
                            suit you best. Each answer would be given a point. The
                            total score would suggest the appropriate risk profiling
                            and risk assessment and suitability of service for you.
                        </p>

                        <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 rounded-r-lg">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                <span className="font-semibold text-slate-900">
                                    Investment involves risk.
                                </span>{" "}
                                The price of securities may go down as well as up,
                                and under certain circumstances an investor may
                                sustain a total or substantial loss of investment.
                                Past performance is not necessarily indicative of
                                the future or likely performance. Investors should
                                read the relevant information document/ statement of
                                additional information and do their own further
                                research before making any investment decisions. An
                                Investor should make an appraisal of the risks
                                involved in investing in these products and should
                                consult their own independent and professional
                                advisors, to ensure that any decision made is
                                suitable with regards to their circumstances and
                                financial position.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 rounded-r-lg">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                <span className="font-semibold text-slate-900">
                                    Our advice:
                                </span>{" "}
                                There are not any right or wrong answers, please
                                follow your instincts and answer the questions.
                                Please answer the following questions by selecting
                                only one response to each question.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50 rounded-r-lg">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                <span className="font-semibold text-slate-900">
                                    IMPORTANT:
                                </span>{" "}
                                Before making any investment decisions, it is
                                important to understand your attitude towards risk.
                                This helps identify an appropriate mix of
                                investments that you are comfortable with. The
                                Finideas Investment Advisor Private Limited Risk
                                Profiling Tool will help you understand your ability
                                to bear risk and identify the asset classes to match
                                your investment needs.
                            </p>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 rounded-r-lg">
                            <p className="text-sm font-semibold text-slate-900">
                                NOTE: All fields are mandatory.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Static Bottom Bar */}
                <div className="border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm sticky bottom-0 shadow-lg">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <span className="text-sm text-slate-500">
                            © IndoThai Securities
                        </span>
                        <VerifyDialog
                            disabled={false}
                            data={[]}
                            handleVerify={agreeHandler}
                            loading={loading}
                            title="Disclaimer"
                            description="Are you sure you want to agree?"
                            mainBtnText="I Agree"
                            verifyBtnText="Yes"
                            cancelBtnText="No"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
