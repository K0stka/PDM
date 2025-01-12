import { Button } from "@/components/ui/button";
import { NextLayout } from "@/lib/utilityTypes";
import SRGH from "@/components/icons/SRGH";
import ThemePicker from "@/components/utility/ThemePicker";
import { configuration } from "@/configuration/configuration";

const Layout: NextLayout = ({ children }) => {
	return (
		<main className="m-auto flex h-dvh w-4/5 select-none flex-col items-center justify-center gap-5 text-center">
			<div
				className="fixed inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,var(--brand))] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,var(--brand))] transition-background"
				style={
					{
						"--brand": configuration.appThemeColor,
					} as React.CSSProperties
				}
			/>
			{children}
			<div className="fixed bottom-5 left-5 ">
				<ThemePicker />
			</div>
			{configuration.SRGHBranding && (
				<div className="fixed bottom-5 right-5 ">
					<Button
						size="icon"
						variant="outline"
						className="flex w-auto cursor-default hover:bg-background items-center gap-2 px-2">
						Akce
						<SRGH className="size-12 scale-125 shrink-0" />
						SRGH
					</Button>
				</div>
			)}
		</main>
	);
};

export default Layout;
