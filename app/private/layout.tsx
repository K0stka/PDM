import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppIcon } from "@/configuration/icon";
import { AuthProvider } from "@/components/context/auth";
import Avatar from "@/components/Avatar";
import { Card } from "@/components/ui/card";
import { NextLayout } from "@/lib/utilityTypes";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { getSessionUserInfo } from "@/auth/session-utils";

const Layout: NextLayout = async ({ children }) => {
	const user = await getSessionUserInfo();

	return (
		<AuthProvider user={user}>
			<SidebarProvider>
				<Sidebar user={user} />
				<main className="h-dvh w-full overflow-hidden grid grid-rows-[1fr,auto] lg:block">
					<div>{children}</div>
					<Card className="md:hidden text-2xl grid grid-cols-[auto,1fr,auto] items-center p-2 rounded-b-none">
						<AppIcon className="size-10" />
						<SidebarTrigger className="[&_svg]:size-7 size-full" />
						<Avatar
							user={user}
							className="size-10"
						/>
					</Card>
				</main>
			</SidebarProvider>
		</AuthProvider>
	);
};

export default Layout;
