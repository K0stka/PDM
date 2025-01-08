import { LucideIcon } from "lucide-react";
import { UserPermissions } from "./types";

type PageInfo = {
	name: string;
	path: string;
	extendable?: true;
	file: string;
	showInSidebar?: true;
	icon?: LucideIcon;
};

export const getPages = ({ isAttending, isPresenting, isAdmin }: UserPermissions): PageInfo[] => {
	const pages: PageInfo[] = [];

	// if (!isAttending && !isPresenting && !isAdmin)
	pages.push({
		name: "Chyba",
		path: "/",
		file: "/invalid-account",
		showInSidebar: true,
	});

	pages.push({
		name: "Nastavení",
		path: "/settings",
		file: "/shared/settings",
	});

	// for (let i = 0; i < 10; i++)
	// 	pages.push({
	// 		name: "Testování",
	// 		path: "/test" + i,
	// 		file: "/test",
	// 		showInSidebar: true,
	// 		icon: BugPlay,
	// 	});

	return pages;
};
