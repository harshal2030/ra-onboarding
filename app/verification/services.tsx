import { VerifyDialog } from "@/components/custom/verify";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Step } from "@/types/steps";
import { ChevronDownIcon, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Service {
    id: number;
    planName: string;
    annualFee: number;
    gstRate: number;
}

type BillingFrequency =
    | "ANNUALLY"
    | "SEMI_ANNUALLY"
    | "QUARTERLY"
    | "MONTHLY";

interface ServiceSelection {
    startDate: Date | undefined;
    billingFrequency: BillingFrequency | undefined;
    advanceCollectionPeriod: string;
    calendarOpen: boolean;
}

const BILLING_LABELS: Record<BillingFrequency, string> = {
    ANNUALLY: "Annually",
    SEMI_ANNUALLY: "Semi-Annually",
    QUARTERLY: "Quarterly",
    MONTHLY: "Monthly",
};

const BILLING_MONTHS: Record<BillingFrequency, number> = {
    MONTHLY: 1,
    QUARTERLY: 3,
    SEMI_ANNUALLY: 6,
    ANNUALLY: 12,
};

const getEndDate = (
    startDate: Date | undefined,
    frequency: BillingFrequency | undefined,
): Date | undefined => {
    if (!startDate || !frequency) return undefined;
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + BILLING_MONTHS[frequency]);
    return d;
};

const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const defaultSelection = (): ServiceSelection => ({
    startDate: undefined,
    billingFrequency: undefined,
    advanceCollectionPeriod: "",
    calendarOpen: false,
});

export const Services = ({ onComplete }: { onComplete: () => void }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selections, setSelections] = useState<
        Record<number, ServiceSelection>
    >({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/services");
                const data = await res.json();
                if (data.success) setServices(data.data);
            } catch {
                toast.error("Failed to load services");
            } finally {
                setFetching(false);
            }
        })();
    }, []);

    const toggleService = (id: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                setSelections((s) => {
                    const next = { ...s };
                    delete next[id];
                    return next;
                });
                return prev.filter((sid) => sid !== id);
            }
            setSelections((s) => ({ ...s, [id]: defaultSelection() }));
            return [...prev, id];
        });
    };

    const updateSelection = (
        id: number,
        field: keyof ServiceSelection,
        value: ServiceSelection[keyof ServiceSelection],
    ) => {
        setSelections((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const isFormComplete = selectedIds.every((id) => {
        const sel = selections[id];
        return (
            sel?.startDate &&
            sel?.billingFrequency &&
            sel?.advanceCollectionPeriod &&
            Number(sel.advanceCollectionPeriod) >= 1
        );
    });

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    step: Step.SERVICES,
                    data: {
                        services: selectedIds.map((id) => {
                            const sel = selections[id];
                            return {
                                service_id: id,
                                start_date: sel.startDate,
                                end_date: getEndDate(
                                    sel.startDate,
                                    sel.billingFrequency,
                                ),
                                billing_frequency: sel.billingFrequency,
                                advance_collection_period: Number(
                                    sel.advanceCollectionPeriod,
                                ),
                            };
                        }),
                        current_step: 5,
                    },
                }),
            });

            if (res.ok) {
                toast.success("Services selected successfully!");
                onComplete();
            } else {
                const data = await res.json();
                if (process.env.NEXT_PUBLIC_ENV === "dev")
                    alert(JSON.stringify(data));
                toast.error("Failed to save services!");
            }
        } catch (error) {
            if (process.env.ENV === "dev") alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    const GST_DEFAULT = 18;
    const gstAmount = (service: Service) =>
        service.annualFee * ((service.gstRate ?? GST_DEFAULT) / 100);
    const feeInclGst = (service: Service) =>
        service.annualFee + gstAmount(service);

    const selectedServices = services.filter((s) =>
        selectedIds.includes(s.id),
    );
    const totalFeeExcl = selectedServices.reduce(
        (sum, s) => sum + s.annualFee,
        0,
    );
    const totalGst = selectedServices.reduce(
        (sum, s) => sum + gstAmount(s),
        0,
    );
    const totalFeeIncl = totalFeeExcl + totalGst;

    if (fetching) {
        return (
            <div className="h-full flex justify-center items-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 px-8 py-6 overflow-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            Select Services
                        </h2>
                        <p className="text-sm text-slate-600">
                            Choose one or more services and configure billing
                            details for each
                        </p>
                    </div>

                    <div className="space-y-4">
                        {services.map((service) => {
                            const isSelected = selectedIds.includes(
                                service.id,
                            );
                            const sel = selections[service.id];
                            return (
                                <div
                                    key={service.id}
                                    className={`rounded-xl border-2 transition-all duration-200 ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/50 shadow-md"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    {/* Service header - clickable */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleService(service.id)
                                        }
                                        className="cursor-pointer w-full text-left p-4 flex items-center gap-3"
                                    >
                                        <div
                                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                                isSelected
                                                    ? "bg-blue-600"
                                                    : "border-2 border-slate-300"
                                            }`}
                                        >
                                            {isSelected && (
                                                <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={3}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3
                                                className={`text-sm font-semibold ${
                                                    isSelected
                                                        ? "text-blue-900"
                                                        : "text-slate-900"
                                                }`}
                                            >
                                                {service.planName}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`text-sm font-medium block ${
                                                    isSelected
                                                        ? "text-blue-700"
                                                        : "text-slate-500"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    service.annualFee,
                                                )}
                                                /year
                                                <span className="text-[10px] font-normal ml-1">
                                                    (excl. GST)
                                                </span>
                                            </span>
                                            <span
                                                className={`text-xs block ${
                                                    isSelected
                                                        ? "text-blue-600"
                                                        : "text-slate-400"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    feeInclGst(service),
                                                )}
                                                /year
                                                <span className="text-[10px] font-normal ml-1">
                                                    (incl.{" "}
                                                    {service.gstRate ??
                                                        GST_DEFAULT}
                                                    % GST)
                                                </span>
                                            </span>
                                        </div>
                                    </button>

                                    {/* Per-service config fields */}
                                    {isSelected && sel && (
                                        <div className="px-4 pb-4 pt-0">
                                            <div className="border-t border-blue-200 pt-4 grid grid-cols-2 gap-4">
                                                {/* Start Date */}
                                                <div>
                                                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                                        Service Start Date
                                                        <span className="text-red-500">
                                                            {" "}
                                                            *
                                                        </span>
                                                    </label>
                                                    <Popover
                                                        open={
                                                            sel.calendarOpen
                                                        }
                                                        onOpenChange={(
                                                            open,
                                                        ) =>
                                                            updateSelection(
                                                                service.id,
                                                                "calendarOpen",
                                                                open,
                                                            )
                                                        }
                                                    >
                                                        <PopoverTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-between font-normal text-xs"
                                                            >
                                                                {sel.startDate
                                                                    ? sel.startDate.toLocaleDateString(
                                                                          "en-GB",
                                                                      )
                                                                    : "Select date"}
                                                                <ChevronDownIcon className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto overflow-hidden p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    sel.startDate
                                                                }
                                                                onSelect={(
                                                                    date,
                                                                ) => {
                                                                    updateSelection(
                                                                        service.id,
                                                                        "startDate",
                                                                        date,
                                                                    );
                                                                    updateSelection(
                                                                        service.id,
                                                                        "calendarOpen",
                                                                        false,
                                                                    );
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                {/* Billing Frequency */}
                                                <div>
                                                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                                        Billing Frequency
                                                        <span className="text-red-500">
                                                            {" "}
                                                            *
                                                        </span>
                                                    </label>
                                                    <Select
                                                        value={
                                                            sel.billingFrequency ??
                                                            ""
                                                        }
                                                        onValueChange={(
                                                            v,
                                                        ) =>
                                                            updateSelection(
                                                                service.id,
                                                                "billingFrequency",
                                                                v as BillingFrequency,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="text-xs">
                                                            <SelectValue placeholder="Select frequency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(
                                                                BILLING_LABELS,
                                                            ).map(
                                                                ([
                                                                    key,
                                                                    label,
                                                                ]) => (
                                                                    <SelectItem
                                                                        key={
                                                                            key
                                                                        }
                                                                        value={
                                                                            key
                                                                        }
                                                                    >
                                                                        {
                                                                            label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Service End Date (auto-calculated) */}
                                                <div>
                                                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                                        Service End Date
                                                    </label>
                                                    <Input
                                                        readOnly
                                                        disabled
                                                        className="text-xs bg-slate-100"
                                                        value={
                                                            getEndDate(
                                                                sel.startDate,
                                                                sel.billingFrequency,
                                                            )
                                                                ? formatDate(
                                                                      getEndDate(
                                                                          sel.startDate,
                                                                          sel.billingFrequency,
                                                                      )!,
                                                                  )
                                                                : "Select start date & frequency"
                                                        }
                                                    />
                                                </div>

                                                {/* Advance Collection Period */}
                                                <div>
                                                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                                                        Advance Collection
                                                        (Months)
                                                        <span className="text-red-500">
                                                            {" "}
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="e.g. 3"
                                                        className="text-xs"
                                                        value={
                                                            sel.advanceCollectionPeriod
                                                        }
                                                        onChange={(e) =>
                                                            updateSelection(
                                                                service.id,
                                                                "advanceCollectionPeriod",
                                                                e.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-medium text-blue-900">
                                    {selectedIds.length} service
                                    {selectedIds.length > 1 ? "s" : ""}{" "}
                                    selected
                                </p>
                            </div>
                            <div className="flex justify-between text-xs text-blue-800">
                                <span>Subtotal (excl. GST)</span>
                                <span>
                                    {formatCurrency(totalFeeExcl)}/year
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-blue-800">
                                <span>GST (18%)</span>
                                <span>{formatCurrency(totalGst)}/year</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-blue-900 border-t border-blue-200 pt-2 mt-2">
                                <span>Total (incl. GST)</span>
                                <span>
                                    {formatCurrency(totalFeeIncl)}/year
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Static Bottom Bar */}
            <div className="flex-none border-t border-slate-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                        © IndoThai Securities
                    </span>
                    <VerifyDialog
                        disabled={
                            selectedIds.length === 0 || !isFormComplete
                        }
                        data={[
                            ...selectedServices.map((s) => {
                                const sel = selections[s.id];
                                return {
                                    label: s.planName,
                                    value: [
                                        `${formatCurrency(s.annualFee)} + ${formatCurrency(gstAmount(s))} GST = ${formatCurrency(feeInclGst(s))}/year`,
                                        sel?.startDate
                                            ? `Start: ${formatDate(sel.startDate)}`
                                            : "",
                                        getEndDate(sel?.startDate, sel?.billingFrequency)
                                            ? `End: ${formatDate(getEndDate(sel.startDate, sel.billingFrequency)!)}`
                                            : "",
                                        sel?.billingFrequency
                                            ? `Billing: ${BILLING_LABELS[sel.billingFrequency]}`
                                            : "",
                                        sel?.advanceCollectionPeriod
                                            ? `Advance: ${sel.advanceCollectionPeriod} month(s)`
                                            : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" | "),
                                };
                            }),
                            {
                                label: "Total (incl. GST)",
                                value: `${formatCurrency(totalFeeIncl)}/year`,
                            },
                        ]}
                        handleVerify={handleVerify}
                        loading={loading}
                        title="Confirm Services"
                        description="Please confirm your selected services and their configuration"
                    />
                </div>
            </div>
        </div>
    );
};
