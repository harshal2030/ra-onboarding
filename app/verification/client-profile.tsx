import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

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
import { Textarea } from "@/components/ui/textarea";
import {
    Gender,
    MaritalStatus,
    PoliticalExpose,
    ResidentialStatus,
    SourceOfIncome,
} from "@/lib/generated/prisma/enums";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { VerifyDialog } from "@/components/custom/verify";
import { Step } from "@/types/steps";
import toast from "react-hot-toast";

export const ClientProfile = ({ onComplete }: { onComplete: () => void }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [nameOfFatherOrSpouse, setNameOfFatherOrSpouse] =
        useState<string>("");
    const [sourceOfIncome, setSourceOfIncome] = useState<
        SourceOfIncome | undefined
    >(undefined);
    const [nationality, setNationality] = useState<string>("");
    const [politicalExposure, setPoliticalExposure] = useState<
        PoliticalExpose | undefined
    >(PoliticalExpose.NO);
    const [countryOfTax] = useState<string>("India");
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string | undefined>(undefined);
    const [residence, setResidence] = useState<ResidentialStatus | undefined>(
        undefined,
    );
    const [maritalStatus, setMaritalStatus] = useState<
        MaritalStatus | undefined
    >(undefined);
    const [gender, setGender] = useState<Gender | undefined>(undefined);

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    step: Step.CLIENT_PROFILE,
                    data: {
                        dob: dateOfBirth,
                        name_of_father_or_spouse: nameOfFatherOrSpouse,
                        source_of_income: sourceOfIncome,
                        nationality: nationality,
                        city: city,
                        address: address,
                        politically_expose: politicalExposure,
                        gender: gender,
                        residential_status: residence,
                        marital_status: maritalStatus,
                        current_step: 4,
                    },
                }),
            });

            if (res.ok) {
                toast.success("Profile updated successfully!");
                onComplete();
            } else {
                const data = await res.json();
                if (process.env.NEXT_PUBLIC_ENV === "dev")
                    alert(JSON.stringify(data));
                toast.error("Failed to update profile details!");
            }
        } catch (error) {
            if (process.env.ENV === "dev") alert(JSON.stringify(error));
            toast.error("Something went wrong, try after sometime!");
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 px-8 py-6">
                {/* Content Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                Client Profile
                            </h2>
                            <p className="text-sm text-slate-600">
                                Please provide your detailed profile information
                            </p>
                        </div>
                        <form className="space-y-6">
                            {/* dob - nameOfFather */}
                            <div className="space-y-2">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-dob">
                                            Date of Birth
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-48 justify-between font-normal"
                                                >
                                                    {dateOfBirth
                                                        ? dateOfBirth.toLocaleDateString()
                                                        : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto overflow-hidden p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={dateOfBirth}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDateOfBirth(date);
                                                        setOpen(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-name-od-father-spouse">
                                            Name of Father or Spouse
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            id="client-profile-name-od-father-spouse"
                                            placeholder="Name of father/Spouse"
                                            value={nameOfFatherOrSpouse}
                                            onChange={(e) =>
                                                setNameOfFatherOrSpouse(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* SourceOfIncome - Nationality */}
                            <div className="space-y-6">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-source-of-income">
                                            Source of Income
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Select
                                            required
                                            value={sourceOfIncome}
                                            onValueChange={(value) =>
                                                setSourceOfIncome(
                                                    value ===
                                                        SourceOfIncome.SALARY
                                                        ? SourceOfIncome.SALARY
                                                        : value ===
                                                            SourceOfIncome.BUSINESS
                                                          ? SourceOfIncome.BUSINESS
                                                          : SourceOfIncome.OTHER,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="client-profile-source-of-income">
                                                <SelectValue placeholder="Source of income" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={
                                                        SourceOfIncome.SALARY
                                                    }
                                                >
                                                    Salary
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        SourceOfIncome.BUSINESS
                                                    }
                                                >
                                                    Business
                                                </SelectItem>
                                                <SelectItem
                                                    value={SourceOfIncome.OTHER}
                                                >
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-source-of-income">
                                            Nationality
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Select
                                            required
                                            value={nationality}
                                            onValueChange={(value) =>
                                                setNationality(value)
                                            }
                                        >
                                            <SelectTrigger id="client-profile-source-of-income">
                                                <SelectValue placeholder="Nationality" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Indian">
                                                    Indian
                                                </SelectItem>
                                                <SelectItem value="Afghan">
                                                    Afghan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* Address - City */}
                            <div className="space-y-6">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-source-of-income">
                                            Address
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Textarea
                                            value={address}
                                            onChange={(e) =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Address"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-source-of-income">
                                            City
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Select
                                            required
                                            value={city}
                                            onValueChange={(value) =>
                                                setCity(value)
                                            }
                                        >
                                            <SelectTrigger id="client-profile-source-of-income">
                                                <SelectValue placeholder="City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Indore">
                                                    Indore
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* Political Expose - Country of tax */}
                            <div className="space-y-6">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-political-exposure">
                                            Politically Expose
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Select
                                            required
                                            value={politicalExposure}
                                            onValueChange={(v) =>
                                                setPoliticalExposure(
                                                    v === PoliticalExpose.YES
                                                        ? PoliticalExpose.YES
                                                        : v ===
                                                            PoliticalExpose.NO
                                                          ? PoliticalExpose.NO
                                                          : v ===
                                                              PoliticalExpose.RELATED
                                                            ? PoliticalExpose.RELATED
                                                            : undefined,
                                                )
                                            }
                                        >
                                            <SelectTrigger id="client-profile-political-exposure">
                                                <SelectValue placeholder="Political" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value={PoliticalExpose.YES}
                                                >
                                                    Yes
                                                </SelectItem>
                                                <SelectItem
                                                    value={PoliticalExpose.NO}
                                                >
                                                    No
                                                </SelectItem>
                                                <SelectItem
                                                    value={
                                                        PoliticalExpose.RELATED
                                                    }
                                                >
                                                    Related
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-source-of-income">
                                            Country of tax
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            value={countryOfTax}
                                            disabled
                                            className="bg-slate-300"
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* RS - MS */}
                            <div className="space-y-6">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-dob">
                                            Residential Status
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <RadioGroupPrimitive.Root
                                            value={residence}
                                            onValueChange={(v) =>
                                                setResidence(
                                                    v ===
                                                        ResidentialStatus.RESIDENTIAL_INDIVIDUAL
                                                        ? ResidentialStatus.RESIDENTIAL_INDIVIDUAL
                                                        : v ===
                                                            ResidentialStatus.NON_RESIDENTIAL_INDIVIDUAL
                                                          ? ResidentialStatus.NON_RESIDENTIAL_INDIVIDUAL
                                                          : undefined,
                                                )
                                            }
                                            className="max-w-md w-full grid grid-cols-2 gap-3"
                                        >
                                            <RadioGroupPrimitive.Item
                                                value={
                                                    ResidentialStatus.RESIDENTIAL_INDIVIDUAL
                                                }
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Resident Individual
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                            <RadioGroupPrimitive.Item
                                                value={
                                                    ResidentialStatus.NON_RESIDENTIAL_INDIVIDUAL
                                                }
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Non Resident Individual
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                        </RadioGroupPrimitive.Root>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-dob">
                                            Marital Status
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <RadioGroupPrimitive.Root
                                            className="max-w-md w-full grid grid-cols-2 gap-3"
                                            value={maritalStatus}
                                            onValueChange={(v) =>
                                                setMaritalStatus(
                                                    v === MaritalStatus.SINGLE
                                                        ? MaritalStatus.SINGLE
                                                        : v ===
                                                            MaritalStatus.MARRIED
                                                          ? MaritalStatus.MARRIED
                                                          : undefined,
                                                )
                                            }
                                        >
                                            <RadioGroupPrimitive.Item
                                                value={MaritalStatus.SINGLE}
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Single
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                            <RadioGroupPrimitive.Item
                                                value={MaritalStatus.MARRIED}
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Married
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                        </RadioGroupPrimitive.Root>
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* Gender */}
                            <div className="space-y-6">
                                <FieldGroup className="grid grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="client-profile-dob">
                                            Gender
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <RadioGroupPrimitive.Root
                                            className="max-w-md w-full grid grid-cols-3 gap-3"
                                            value={gender}
                                            onValueChange={(v) =>
                                                setGender(
                                                    v === Gender.MALE
                                                        ? Gender.MALE
                                                        : v === Gender.FEMALE
                                                          ? Gender.FEMALE
                                                          : v === Gender.OTHER
                                                            ? Gender.OTHER
                                                            : undefined,
                                                )
                                            }
                                        >
                                            <RadioGroupPrimitive.Item
                                                value={Gender.MALE}
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Male
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                            <RadioGroupPrimitive.Item
                                                value={Gender.FEMALE}
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Female
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                            <RadioGroupPrimitive.Item
                                                value={Gender.OTHER}
                                                className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
                                            >
                                                <span className="text-xs tracking-tight">
                                                    Other
                                                </span>
                                            </RadioGroupPrimitive.Item>
                                        </RadioGroupPrimitive.Root>
                                    </Field>
                                </FieldGroup>
                            </div>
                        </form>
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
                                !dateOfBirth ||
                                !nameOfFatherOrSpouse ||
                                !sourceOfIncome ||
                                !nationality ||
                                !address ||
                                !city ||
                                !residence ||
                                !maritalStatus ||
                                !gender
                            }
                            data={[
                                {
                                    label: "Date of Birth",
                                    value: dateOfBirth
                                        ? new Intl.DateTimeFormat(
                                              "en-GB",
                                          ).format(dateOfBirth)
                                        : "-",
                                },
                                {
                                    label: "Name of Father or Spouse",
                                    value: nameOfFatherOrSpouse ?? "-",
                                },
                                {
                                    label: "Source of income",
                                    value:
                                        sourceOfIncome === SourceOfIncome.SALARY
                                            ? "Salary"
                                            : sourceOfIncome ===
                                                SourceOfIncome.BUSINESS
                                              ? "Business"
                                              : sourceOfIncome ===
                                                  SourceOfIncome.OTHER
                                                ? "Others"
                                                : "-",
                                },
                                {
                                    label: "Nationality",
                                    value: nationality ?? "-",
                                },
                                {
                                    label: "Address",
                                    value: address ?? "-",
                                },
                                {
                                    label: "City",
                                    value: city ?? "-",
                                },
                                {
                                    label: "Politically Expose",
                                    value: politicalExposure ?? "-",
                                },
                                {
                                    label: "Country of Tax",
                                    value: countryOfTax ?? "-",
                                },
                                {
                                    label: "Residential Status",
                                    value:
                                        residence ===
                                        ResidentialStatus.RESIDENTIAL_INDIVIDUAL
                                            ? "Residential Individual"
                                            : residence ===
                                                ResidentialStatus.NON_RESIDENTIAL_INDIVIDUAL
                                              ? "Non-Residential Individual"
                                              : "-",
                                },
                                {
                                    label: "Marital Status",
                                    value:
                                        maritalStatus === MaritalStatus.SINGLE
                                            ? "Single"
                                            : maritalStatus ===
                                                MaritalStatus.MARRIED
                                              ? "Married"
                                              : "-",
                                },
                                {
                                    label: "Gender",
                                    value:
                                        gender === Gender.MALE
                                            ? "Male"
                                            : gender === Gender.FEMALE
                                              ? "Female"
                                              : gender === Gender.OTHER
                                                ? "Other"
                                                : "-",
                                },
                            ]}
                            handleVerify={handleVerify}
                            loading={loading}
                            title="Verify Your Details"
                        />
                </div>
            </div>
        </div>
    );
};
