"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, SunMoon } from "lucide-react";

import { Button } from "../ui/button";
import { useTheme } from "next-themes";

interface ThemePickerProps {
	variant?: "standalone" | "sidebar";
}

const ThemePicker = ({ variant }: ThemePickerProps) => {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className="cursor-pointer">
				{variant === "sidebar" ? (
					<DropdownMenuItem>
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						Změnit motiv aplikace
					</DropdownMenuItem>
				) : (
					<Button
						variant="outline"
						size="icon">
						<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun />
					Světlý
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon />
					Tmavý
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<SunMoon />
					Automaticky
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ThemePicker;
