"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SetState } from "@/lib/utilityTypes";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

type ComboBoxValue<T extends string | number> = {
    value: T;
    label?: string;
};

interface ComboBoxProps<T extends string | number> {
    value: T | undefined | null;
    onChange: (value: T) => void;
    values: ComboBoxValue<T>[];
    placeholder?: string;
    className?: string;
    readonly?: boolean;
}

export function ComboBox<T extends string | number>({
    values,
    value,
    onChange,
    placeholder,
    className,
    readonly,
}: ComboBoxProps<T>) {
    const isMobile = useIsMobile();
    const [open, setOpenState] = useState(false);

    const setOpen = (value: boolean) => {
        if (!readonly) setOpenState(value);
    };

    const selected = values.find((v) => v.value === value);
    const label = selected?.label ?? selected?.value;

    if (isMobile)
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[150px] justify-start overflow-auto",
                            className,
                        )}
                    >
                        {label ?? placeholder ?? "Prosím vyberte možnost..."}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="sr-only">
                        <DrawerTitle />
                        <DrawerDescription />
                    </DrawerHeader>
                    <div className="mt-4 border-t pb-4">
                        <ValuesList
                            values={values}
                            setOpen={setOpen}
                            onChange={onChange}
                            selectedValue={value}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[150px] justify-start overflow-auto",
                        className,
                    )}
                >
                    {label ?? placeholder ?? "Prosím vyberte možnost..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <ValuesList
                    values={values}
                    setOpen={setOpen}
                    onChange={onChange}
                    selectedValue={value}
                />
            </PopoverContent>
        </Popover>
    );
}

interface ValuesListProps<T extends string | number> {
    values: ComboBoxValue<T>[];
    setOpen: SetState<boolean>;
    onChange: (status: T) => void;
    selectedValue: T | undefined | null;
}

function ValuesList<T extends string | number>({
    values,
    setOpen,
    onChange,
    selectedValue,
}: ValuesListProps<T>) {
    return (
        <Command>
            <CommandInput placeholder="Vyhledat..." />
            <CommandList>
                <CommandEmpty>
                    Žádná z možností neodpovídá hledání...
                </CommandEmpty>
                <CommandGroup>
                    {values.map((val) => {
                        const isSelected = selectedValue === val.value;
                        return (
                            <CommandItem
                                className="flex items-center justify-between p-3 md:px-2 md:py-1.5"
                                key={val.value}
                                onSelect={() => {
                                    onChange(val.value);
                                    setOpen(false);
                                }}
                            >
                                <span>{val.label ?? val.value}</span>
                                {isSelected && (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
