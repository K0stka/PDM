import * as motion from "motion/react-client";

import { PageInfo, getPages } from "@/lib/pages";

import { AppIcon } from "@/configuration/icon";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { NextPage } from "next";
import SRGH from "@/components/icons/SRGH";
import { configuration } from "@/configuration/configuration";
import { session } from "@/auth/session";

interface HomePageButtonProps {
	href: string;
	text: string;
	icon: LucideIcon;
}

const HomePageButton = ({ href, text, ...icon }: HomePageButtonProps) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}>
		<Link href={href}>
			<Card className="size-40 flex p-2 flex-col items-center justify-center gap-2">
				<icon.icon className="size-16" />
				<span className="text-center">{text}</span>
			</Card>
		</Link>
	</motion.div>
);

const HomePage: NextPage = async () => {
	const pages = getPages(await session()).filter((p) => p.showOnHomepage) as (PageInfo & { showOnHomepage: true })[];

	return (
		<div className="size-full flex flex-col content-center items-center justify-center gap-8">
			<h1 className="text-3xl font-bold nunito flex gap-3 items-center">
				<AppIcon className="size-12" />
				<div className="flex flex-col">
					<div>{configuration.appName}</div>
					{configuration.SRGHBranding && (
						<div className="text-sm hepta-slab font-normal opacity-50">
							Akce
							<SRGH
								variant="outline"
								className="px-1 align-text-top"
							/>
							SRGH
						</div>
					)}
				</div>
			</h1>
			<div className="flex flex-wrap gap-4 justify-center">
				{pages.map((page, i) => (
					<HomePageButton
						key={i}
						href={page.path}
						text={page.name}
						icon={page.icon}
					/>
				))}
			</div>
		</div>
	);
};

export default HomePage;
