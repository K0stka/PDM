"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { SetState } from "@/lib/utilityTypes";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

type ComboBoxValue = {
	value: string;
	label?: string;
};

interface ComboBoxProps {
	value: string | undefined | null;
	onChange: (value: string) => void;
	values: ComboBoxValue[];
	placeholder?: string;
	className?: string;
}

export function ComboBox({ values, value, onChange, placeholder, className }: ComboBoxProps) {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	if (isMobile)
		return (
			<Drawer
				open={open}
				onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						variant="outline"
						className={cn("w-[150px] justify-start", className)}>
						{value ?? placeholder ?? "Prosím vyberte možnost..."}
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
							setOpen={setOpen}
							onChange={onChange}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn("w-[150px] justify-start", className)}>
					{value ?? placeholder ?? "Prosím vyberte možnost..."}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[200px] p-0"
				align="start">
				<ValuesList
					values={values}
					setOpen={setOpen}
					onChange={onChange}
				/>
			</PopoverContent>
		</Popover>
	);
}

interface ValuesListProps {
	values: ComboBoxValue[];
	setOpen: SetState<boolean>;
	onChange: (status: string) => void;
}

function ValuesList({ values, setOpen, onChange }: ValuesListProps) {
	return (
		<Command>
			<CommandInput placeholder="Vyhledat..." />
			<CommandList>
				<CommandEmpty>Žádná z možností neodpovídá hledání...</CommandEmpty>
				<CommandGroup>
					{values.map((value) => (
						<CommandItem
							key={value.value}
							value={value.value}
							onSelect={() => {
								onChange(value.value);
								setOpen(false);
							}}>
							{value.label ?? value.value}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
