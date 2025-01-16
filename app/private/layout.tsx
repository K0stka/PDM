import { NextLayout } from "@/lib/utilityTypes";
import { Sidebar } from "@/components/sidebar/Sidebar";
import SidebarPhoneToggle from "@/components/sidebar/SidebarPhoneToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/components/context/auth";
import { session } from "@/auth/session";

const Layout: NextLayout = async ({ children }) => {
	const user = await session();

	return (
		<UserProvider user={user}>
			<SidebarProvider>
				<Sidebar />
				<main className="h-dvh w-full overflow-hidden relative grid grid-rows-[1fr,auto] md:grid-rows-1">
					<div className="overflow-y-auto">{children}</div>
					<SidebarPhoneToggle />
				</main>
			</SidebarProvider>
		</UserProvider>
	);
};

export default Layout;
