import { CalendarCog, CalendarRange, House, LibraryBig, LucideIcon, MapPinned, Presentation, SquareCheck, UserRoundCog } from "lucide-react";

import { Either } from "./utilityTypes";
import { UserPermissions } from "./types";
import { roleNames } from "@/configuration/roles";

export type PageInfo = {
	path: string;
	extendable?: true;
	file: string;
} & Either<{}, (Either<{ showInSidebar: true }, { showOnHomepage: true }> | { showInSidebar: true; showOnHomepage: true }) & { name: string; icon: LucideIcon; category: keyof typeof roleNames | "misc" }>;

export const getPages = ({ isAttending, isPresenting, isAdmin }: UserPermissions): PageInfo[] => {
	const pages: PageInfo[] = [];

	if (!isAttending && !isPresenting && !isAdmin)
		pages.push({
			path: "/",
			file: "/invalid-account",
		});
	else
		pages.push({
			name: "Domů",
			path: "/",
			file: "/shared/home",
			showInSidebar: true,
			icon: House,
			category: "misc",
		});

	if (isAttending)
		pages.push(
			{
				name: "Kde mám teď být?",
				path: "/attending",
				file: "/attending/now",
				showInSidebar: true,
				showOnHomepage: true,
				icon: MapPinned,
				category: "attending",
			},
			{
				name: "Anotace dílen",
				path: "/workshops",
				file: "/attending/workshops",
				showInSidebar: true,
				showOnHomepage: true,
				icon: LibraryBig,
				category: "attending",
			},
			{
				name: "Volba dílen",
				path: "/claims",
				file: "/attending/claims",
				showInSidebar: true,
				showOnHomepage: true,
				icon: SquareCheck,
				category: "attending",
			}
		);

	if (isAdmin)
		pages.push(
			{
				name: "Rozvrh",
				path: "/timetable",
				file: "/admin/timetable",
				showInSidebar: true,
				showOnHomepage: true,
				icon: CalendarRange,
				category: "admin",
			},
			{
				name: "Správa dílen",
				path: "/workshops/edit",
				file: "/admin/archetypes",
				showInSidebar: true,
				showOnHomepage: true,
				icon: CalendarCog,
				category: "admin",
			},
			{
				name: "Správa uživatelů",
				path: "/users",
				file: "/admin/users",
				showInSidebar: true,
				showOnHomepage: true,
				icon: UserRoundCog,
				category: "admin",
			}
		);

	pages.push({
		path: "/settings",
		file: "/shared/settings",
	});

	return pages;
};
