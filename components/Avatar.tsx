"use client";

import { AvatarFallback, Avatar as ShadCnAvatar } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AvatarProps {
	user: Pick<User, "name" | "colors">;
	nameOnHover?: boolean;
	onClick?: () => void;
	className?: string;
}

const Avatar = ({
	user: {
		name,
		colors: { light, dark },
	},
	nameOnHover,
	onClick,
	className,
}: AvatarProps) => {
	const names = name.split(" ");

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<ShadCnAvatar
						className={cn("h-8 w-8 rounded-lg", className)}
						onClick={onClick}>
						<AvatarFallback
							suppressHydrationWarning
							className={cn("nunito select-none rounded-lg bg-[var(--light)] text-base font-bold text-[var(--dark)] dark:bg-[var(--dark)] dark:text-[var(--light)]", {
								"text-xs": names.length > 2,
							})}
							style={
								{
									"--light": light,
									"--dark": dark,
								} as React.CSSProperties
							}>
							{names
								.map((name) => name[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</ShadCnAvatar>
				</TooltipTrigger>
				{nameOnHover && (
					<TooltipContent>
						<p>{name}</p>
					</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};

export default Avatar;
