import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export const ClientProfile = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
        <>
            {/* Main Content + Bottom Bar */}
            <div className="flex flex-col flex-1">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <Card className="p-6">
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
                                                    {date
                                                        ? date.toLocaleDateString()
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
                                                    selected={date}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDate(date);
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
                                            required
                                        />
                                    </Field>
                                </FieldGroup>
                            </div>
                            {/* SourceOfIncome - Nationality */}
                            <div className="space-y-6">
                                <Field>
                                    <FieldLabel htmlFor="client-profile-source-of-income">
                                        Source of Income
                                        <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Select required>
                                        <SelectTrigger id="client-profile-source-of-income">
                                            <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="individual">
                                                Individual
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </form>
                    </Card>
                </div>
                {/* Static Bottom Bar */}
            </div>
        </>
    );
};
