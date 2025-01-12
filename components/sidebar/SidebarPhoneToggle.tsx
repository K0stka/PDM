"use client";

import { AppIcon } from "@/configuration/icon";
import Avatar from "../Avatar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ChevronsUp } from "lucide-react";
import { UserContext } from "../context/auth";
import { use } from "react";
import { useSidebar } from "../ui/sidebar";

const SidebarPhoneToggle = () => {
	const user = use(UserContext);

	const { toggleSidebar } = useSidebar();

	return (
		<Card className="md:hidden text-2xl grid grid-cols-[auto,1fr,auto] gap-2 items-center p-2 rounded-b-none">
			<AppIcon className="size-10" />
			<Button
				size="icon"
				variant="ghost"
				className="[&_svg]:size-7 size-full hover:bg-transparent"
				onClick={toggleSidebar}>
				<ChevronsUp />
			</Button>
			<Avatar
				user={user}
				className="size-10"
			/>
		</Card>
	);
};

export default SidebarPhoneToggle;
