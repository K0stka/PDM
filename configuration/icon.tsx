import { ImageResponse } from "next/og";
import SRGH from "@/components/icons/SRGH";
import { cn } from "@/lib/utils";

type AppIconProps = {
	className?: string;
	style?: React.CSSProperties;
};

export const AppIcon = ({ className, style }: AppIconProps) => {
	return (
		<SRGH
			style={style}
			className={cn("aspect-square size-10 shrink-0 bg-white p-1 rounded", className)}
		/>
	);
};

export const generateIconPng = (size: number) => {
	return new ImageResponse(
		(
			<AppIcon
				style={{
					width: "80%",
					height: "80%",
					margin: `${size / 10}px`,
					padding: `${size / 10}px`,
					borderRadius: `${size / 10}px`,
					background: "white",
				}}
			/>
		),
		{
			width: size,
			height: size,
		}
	);
};
