"use client";

import { Sidebar as ShadCnSidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

import SidebarLinks from "./SidebarLinks";
import SidebarLogo from "./SidebarLogo";
import { SidebarUser } from "@/components/sidebar/SidebarUser";
import { User } from "@/lib/types";

export function Sidebar({ user, ...props }: React.ComponentProps<typeof ShadCnSidebar> & { user: User }) {
	return (
		<ShadCnSidebar
			collapsible="icon"
			{...props}
			className="select-none bg-secondary/50">
			<SidebarHeader>
				<SidebarLogo />
			</SidebarHeader>
			<SidebarContent>
				<SidebarLinks user={user} />
			</SidebarContent>
			<SidebarFooter>
				<SidebarUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</ShadCnSidebar>
	);
}
