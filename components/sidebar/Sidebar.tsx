"use client";

import { Sidebar as ShadCnSidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

import SRGH from "../icons/SRGH";
import SidebarLinks from "./SidebarLinks";
import SidebarLogo from "./SidebarLogo";
import { SidebarUser } from "@/components/sidebar/SidebarUser";
import { configuration } from "@/configuration/configuration";

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadCnSidebar>) {
	return (
		<ShadCnSidebar
			collapsible="icon"
			{...props}
			className="select-none bg-secondary/50">
			<SidebarHeader>
				<SidebarLogo />
			</SidebarHeader>
			<SidebarContent>
				<SidebarLinks />
			</SidebarContent>
			<SidebarFooter>
				<SidebarUser />
				{configuration.SRGHBranding && (
					<div className="md:hidden flex items-center justify-center opacity-50 gap-2 mt-2">
						Akce
						<SRGH variant="outline" />
						SRGH
					</div>
				)}
			</SidebarFooter>
			<SidebarRail />
		</ShadCnSidebar>
	);
}
