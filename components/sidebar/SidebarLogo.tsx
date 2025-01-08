import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";

import { AppIcon } from "@/configuration/icon";
import { configuration } from "@/configuration/configuration";

const SidebarLogo = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<h1 className="nunito flex flex-row items-center justify-center md:justify-start gap-3 overflow-hidden text-3xl md:text-2xl data-[state=open]:py-3">
					<AppIcon className="md:size-8 shrink-0" />
					<div className="shrink-0">{configuration.appName}</div>
				</h1>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default SidebarLogo;
