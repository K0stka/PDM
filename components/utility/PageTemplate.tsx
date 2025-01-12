import { ButtonProps } from "../ui/button";
import { LucideIcon } from "lucide-react";
import PageTemplateTitle from "./PageTemplateTitle";
import { cn } from "@/lib/utils";

interface PageTemplateProps {
	title?: React.ReactNode;
	children?: React.ReactNode;
	actions?: {
		id: string;
		text: string;
		icon?: React.ReactElement<LucideIcon>;
		onClick: () => void;
		props?: ButtonProps;
	}[];
	footer?: React.ReactNode;
}

const PageTemplate = ({ title, children, actions, footer }: PageTemplateProps) => {
	return (
		<div
			className={cn("relative box-border grid min-h-full gap-5 md:h-dvh md:overflow-y-hidden md:p-10", {
				"grid-rows-[auto,1fr]": !!title && !footer,
				"grid-rows-[auto,1fr,auto]": !!title && !!footer,
				"grid-rows-[1fr,auto]": !title && !!footer,
				"grid-rows-1fr": !title && !footer,
			})}>
			{title && (
				<h1 className="nunito flex items-center justify-between p-5 pb-0 text-3xl font-bold md:mb-2 md:p-0">
					<PageTemplateTitle
						title={title}
						actions={actions}
					/>
				</h1>
			)}
			<div className="relative px-5 pb-5 md:h-full md:overflow-y-auto md:p-0">{children}</div>
			{footer && <div>{footer}</div>}
		</div>
	);
};

export default PageTemplate;
