import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import Link from "next/link";
import { User } from "@/lib/types";
import { getPages } from "@/lib/pages";

interface SidebarLinksProps {
	user: User;
}

const SidebarLinks = ({ user }: SidebarLinksProps) => {
	const pages = getPages(user).filter((page) => page.showInSidebar);

	return (
		<SidebarGroup>
			<SidebarMenu>
				{pages.map((item) => (
					<SidebarMenuItem key={item.path}>
						<SidebarMenuButton
							asChild
							className="transition-colors hover:bg-accent h-auto">
							<Link
								href={item.path}
								className="text-nowrap flex items-center gap-2 text-xl [&_svg]:size-6 md:text-base md:[&_svg]:size-4">
								{item.icon && <item.icon />}

								{item.name}
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
};

export default SidebarLinks;
