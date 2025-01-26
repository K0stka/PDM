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

type MultiSelectValue<T extends string | number> = {
    value: T;
    label?: string;
};

interface MultiSelectProps<T extends string | number> {
    value: T[];
    onChange: (values: T[]) => void;
    values: MultiSelectValue<T>[];
    placeholder?: string;
    className?: string;
}

export function MultiSelect<T extends string | number>({
    values,
    value,
    onChange,
    placeholder,
    className,
}: MultiSelectProps<T>) {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);

    const selected = values.filter((v) => value?.includes(v.value));
    const label = selected.length
        ? selected.map((s) => s.label ?? s.value).join(", ")
        : (placeholder ?? "Prosím vyberte možnosti...");

    if (isMobile)
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[150px] justify-start truncate",
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
                    <div className="mt-4 border-t">
                        <ValuesList
                            values={values}
                            onChange={onChange}
                            selectedValues={value}
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
                        "w-[150px] justify-start truncate",
                        className,
                    )}
                >
                    {label ?? placeholder ?? "Prosím vyberte možnost..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <ValuesList
                    values={values}
                    onChange={onChange}
                    selectedValues={value}
                />
            </PopoverContent>
        </Popover>
    );
}

interface ValuesListProps<T extends string | number> {
    values: MultiSelectValue<T>[];
    onChange: SetState<T[]>;
    selectedValues?: T[];
}

function ValuesList<T extends string | number>({
    values,
    onChange,
    selectedValues,
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
                        const isSelected = selectedValues?.includes(val.value);
                        return (
                            <CommandItem
                                key={val.value}
                                onSelect={() => {
                                    onChange((prev?: T[]) => {
                                        if (prev?.includes(val.value)) {
                                            return prev.filter(
                                                (item: T) => item !== val.value,
                                            );
                                        }
                                        return [...(prev ?? []), val.value];
                                    });
                                }}
                                className="flex items-center justify-between"
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
