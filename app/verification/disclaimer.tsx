import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export const Disclaimer = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <>
            {/* Main Content + Bottom Bar */}
            <div className="flex flex-col flex-1">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <p>Dear Investor,</p>
                    <p>
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
                    <p>
                        Investment involves risk. The price of securities may go
                        down as well as up, and under certain circumstances an
                        investor may sustain a total or substantial loss of
                        investment. Past performance is not necessarily
                        indicative of the future or likely performance.
                        Investors should read the relevant information document/
                        statement of additional information and do their own
                        further research before making any investment decisions.
                        An Investor should make an appraisal of the risks
                        involved in investing in these products and should
                        consult their own independent and professional advisors,
                        to ensure that any decision made is suitable with
                        regards to their circumstances and financial position.
                    </p>
                    <p>
                        Our advice: There are not any right or wrong answers,
                        please follow your instincts and answer the questions.
                        Please answer the following questions by selecting only
                        one response to each question
                    </p>
                    <p>
                        IMPORTANT: Before making any investment decisions, it is
                        important to understand your attitude towards risk. This
                        helps identify an appropriate mix of investments that
                        you are comfortable with. The Finideas Investment
                        Advisor Private Limited Risk Profiling Tool will help
                        you understand your ability to bear risk and identify
                        the asset classes to match your investment needs
                    </p>
                    <p>NOTE :- All fields are mandatory.</p>
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
                                    <Button className="px-6 py-1 rounded cursor-pointer">
                                        I Agree
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogTitle>Disclaimer</DialogTitle>
                                    <div>Are you sure you want to agree?</div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                No
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            onClick={() => onComplete()}
                                        >
                                            Yes
                                        </Button>
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
