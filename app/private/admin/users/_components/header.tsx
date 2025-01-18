import { ArrowDownAZ, ArrowDownWideNarrow, ArrowDownZA, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	column?: Column<TData, TValue>;
	first?: true;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className, first }: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column || !column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={cn("h-8 data-[state=open]:bg-accent", {
							"-ml-3": !first,
						})}>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? <ArrowDownZA /> : column.getIsSorted() === "asc" ? <ArrowDownAZ /> : <ArrowDownWideNarrow />}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowDownAZ className="h-3.5 w-3.5 text-muted-foreground/70" />
						Vzestupně
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDownZA className="h-3.5 w-3.5 text-muted-foreground/70" />
						Sestupně
					</DropdownMenuItem>
					{column.getIsSorted() && (
						<DropdownMenuItem
							className="text-muted-foreground"
							onClick={() => column.toggleSorting()}>
							<X className="h-3.5 w-3.5 text-muted-foreground/70" />
							Zrušit
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
