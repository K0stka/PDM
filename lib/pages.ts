import {
    CalendarCog,
    CalendarRange,
    ChartColumnBig,
    ChartColumnStacked,
    ChartPie,
    House,
    LibraryBig,
    LucideIcon,
    MapPin,
    PocketKnife,
    SquareCheck,
    Timer,
    UserRoundCog,
} from "lucide-react";

import { Either } from "./utilityTypes";
import { UserPermissions } from "./types";
import { claimsVisible } from "@/validation/claim";
import { configuration } from "@/configuration/configuration";
import { roleNames } from "@/configuration/roles";

export type PageInfo = {
    path: string;
    extendable?: true;
    file: string;
} & Either<
    object,
    (
        | Either<{ showInSidebar: true }, { showOnHomepage: true }>
        | { showInSidebar: true; showOnHomepage: true }
    ) & {
        name: string;
        icon: LucideIcon;
        category: keyof typeof roleNames | "misc" | "maintenance";
    }
>;

export const getPages = ({
    isAttending,
    isTeacher,
    isPresenting,
    isAdmin,
}: UserPermissions): PageInfo[] => {
    const pages: PageInfo[] = [];

    if (!isAttending && !isTeacher && !isPresenting && !isAdmin)
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
            // {
            // 	name: "Kde mám teď být?",
            // 	path: "/attending",
            // 	file: "/attending/now",
            // 	showInSidebar: true,
            // 	showOnHomepage: true,
            // 	icon: MapPinned,
            // 	category: "attending",
            // },
            {
                name: "Anotace přednášek",
                path: "/workshops",
                file: "/shared/workshops",
                showInSidebar: true,
                showOnHomepage: true,
                icon: LibraryBig,
                category: "attending",
            },
            ...(claimsVisible({ isAdmin })
                ? [
                      {
                          name: "Volba přednášek",
                          path: "/claims",
                          file: "/attending/claims",
                          showInSidebar: true,
                          showOnHomepage: true,
                          icon: SquareCheck,
                          category: "attending",
                      } as PageInfo,
                  ]
                : []),
        );

    if (isTeacher)
        if (!isAttending)
            pages.push({
                name: "Anotace přednášek",
                path: "/workshops",
                file: "/shared/workshops",
                showInSidebar: true,
                showOnHomepage: true,
                icon: LibraryBig,
                category: "teacher",
            });

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
                name: "Správa přednášek",
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
            },
            {
                name: "Správa bloků",
                path: "/blocks",
                file: "/admin/blocks",
                showInSidebar: true,
                icon: Timer,
                category: "admin",
            },
            {
                name: "Správa míst",
                path: "/places",
                file: "/admin/places",
                showInSidebar: true,
                icon: MapPin,
                category: "admin",
            },
            {
                name: "Správa voleb",
                path: "/claims/manage",
                file: "/admin/claims",
                showInSidebar: true,
                icon: ChartPie,
                category: "admin",
            },
            ...(configuration.collectInterest
                ? [
                      {
                          name: "Průzkum zájmu",
                          path: "/interest",
                          file: "/admin/interest",
                          showInSidebar: true,
                          icon: ChartColumnBig,
                          category: "admin",
                      } as PageInfo,
                  ]
                : []),
            {
                name: "Statistika tříd",
                path: "/classes",
                file: "/admin/classes",
                showInSidebar: true,
                icon: ChartColumnStacked,
                category: "admin",
            },
            {
                name: "Nástroje",
                path: "/utility",
                file: "/admin/utility",
                showInSidebar: true,
                icon: PocketKnife,
                category: "maintenance",
            },
        );

    pages.push({
        path: "/settings",
        file: "/shared/settings",
    });

    return pages;
};
