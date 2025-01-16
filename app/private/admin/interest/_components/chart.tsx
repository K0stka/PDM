"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { Archetype } from "@/lib/types";

interface InterestChartProps {
	archetypes: { name: Archetype["name"]; interested: number }[];
}

const InterestChart = ({ archetypes }: InterestChartProps) => {
	return (
		<ChartContainer
			config={{
				interested: {
					label: "Zájem",
					color: "hsl(var(--chart-1))",
				},
			}}>
			<BarChart
				accessibilityLayer
				data={archetypes}
				layout="vertical">
				<XAxis
					type="number"
					dataKey="interested"
				/>
				<YAxis
					dataKey="name"
					type="category"
					tickLine={false}
					tickMargin={10}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar
					dataKey="interested"
					fill="#eab308"
					radius={5}
				/>
			</BarChart>
		</ChartContainer>
	);
};

export default InterestChart;
