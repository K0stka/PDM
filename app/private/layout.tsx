import ClassSelector from "./shared/settings/_components/classSelector";
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
				<main className="h-dvh w-full overflow-hidden grid grid-rows-[1fr,auto] md:grid-rows-1">
					<div className="overflow-auto">
						{!user.isAttending || user.class ? (
							children
						) : (
							<div className="size-full flex items-center justify-center">
								<ClassSelector
									title="Než budete pokračovat..."
									revalidatePathOnSuccess
								/>
							</div>
						)}
					</div>
					<SidebarPhoneToggle />
				</main>
			</SidebarProvider>
		</UserProvider>
	);
};

export default Layout;
