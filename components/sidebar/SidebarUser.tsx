"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import Avatar from "../Avatar";
import Link from "next/link";
import ThemePicker from "../utility/ThemePicker";
import { User } from "@/lib/types";
import { logout } from "@/auth/actions";

type SidebarUserProps = {
	user: User;
};

export function SidebarUser({ user }: SidebarUserProps) {
	const { isMobile } = useSidebar();
	const userRole = user.isAdmin ? "Administrátor" : user.isPresenting ? "Prezentující" : user.isAttending ? "Účastník" : null;

	return (
		<SidebarMenu className="rounded-2xl p-1 md:rounded-sm md:p-0 transition-colors bg-secondary md:bg-transparent md:hover:bg-secondary">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:p-0 h-auto">
							<Avatar user={user} />
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold text-lg md:text-base">{user.name}</span>
								<span className="truncate text-xs hidden md:block">{userRole}</span>
							</div>
							<MoreHorizontal className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="select-none p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar user={user} />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<ThemePicker variant="sidebar" />
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href="/settings">
								<DropdownMenuItem className="cursor-pointer">
									<Settings />
									Nastavení
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={logout}>
							<LogOut />
							Odhlásit se
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
