"use client";

import { Button, ButtonProps } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageTemplateTitleProps {
	title?: React.ReactNode;
	actions?: {
		id: string;
		text: string;
		icon?: React.ReactNode;
		onClick: () => void;
		props?: ButtonProps;
	}[];
}

const PageTemplateTitle = ({ title, actions = [] }: PageTemplateTitleProps) => {
	const isMobile = useIsMobile();
	return (
		<>
			{title && <div className="basis-full">{title}</div>}
			{actions.length > 0 &&
				(isMobile ? (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-8 w-8 p-0">
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{actions.map((action) => (
									<DropdownMenuItem
										key={action.id}
										onClick={action.onClick}>
										{action.icon}
										{action.text}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				) : (
					<div className="flex flex-wrap items-center justify-end gap-2">
						{actions.map((action) => (
							<Button
								key={action.id}
								onClick={action.onClick}
								{...action.props}>
								{action.icon}
								{action.text}
							</Button>
						))}
					</div>
				))}
		</>
	);
};

export default PageTemplateTitle;
