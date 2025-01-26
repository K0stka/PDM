import { PageInfo, getPages } from "@/lib/pages";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../ui/sidebar";

import Link from "next/link";
import { UserContext } from "../context/auth";
import { getRoleName } from "@/lib/roles";
import { use } from "react";

const SidebarLinksGroup = ({
    title,
    pages,
}: {
    title?: string;
    pages: (PageInfo & { showInSidebar: true })[];
}) => {
    const { setOpenMobile } = useSidebar();

    return (
        <SidebarGroup>
            {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {pages.map((page) => (
                        <SidebarMenuItem key={page.path}>
                            <SidebarMenuButton
                                asChild
                                className="h-auto transition-colors hover:bg-accent"
                            >
                                <Link
                                    onClick={() => setOpenMobile(false)}
                                    href={page.path}
                                    className="flex items-center gap-2 text-nowrap text-base [&_svg]:size-4"
                                >
                                    <page.icon />

                                    {page.name}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

const SidebarLinks = () => {
    const user = use(UserContext);

    const pages = getPages(user).filter(
        (page) => page.showInSidebar,
    ) as (PageInfo & { showInSidebar: true })[];

    const categories = [
        {
            pages: [] as (PageInfo & { showInSidebar: true })[],
        },
        {
            title: getRoleName("attending"),
            pages: [] as (PageInfo & { showInSidebar: true })[],
        },
        {
            title: getRoleName("presenting"),
            pages: [] as (PageInfo & { showInSidebar: true })[],
        },
        {
            title: getRoleName("admin"),
            pages: [] as (PageInfo & { showInSidebar: true })[],
        },
        {
            title: "Údržba",
            pages: [] as (PageInfo & { showInSidebar: true })[],
        },
    ];

    pages.forEach((page) => {
        switch (page.category) {
            case "attending":
                categories[1].pages.push(page);
                break;
            case "presenting":
                categories[2].pages.push(page);
                break;
            case "admin":
                categories[3].pages.push(page);
                break;
            case "maintenance":
                categories[4].pages.push(page);
                break;
            default:
                categories[0].pages.push(page);
        }
    });

    const showTitles =
        (categories[1].pages.length > 0 ? 1 : 0) +
            (categories[2].pages.length > 0 ? 1 : 0) +
            (categories[3].pages.length > 0 ? 1 : 0) +
            (categories[4].pages.length > 0 ? 1 : 0) >
        1;

    return (
        <>
            {showTitles ? (
                categories
                    .filter((category) => category.pages.length > 0)
                    .map((category, i) => (
                        <SidebarLinksGroup
                            key={i}
                            title={category.title}
                            pages={category.pages}
                        />
                    ))
            ) : (
                <SidebarLinksGroup pages={pages} />
            )}
        </>
    );
};

export default SidebarLinks;
