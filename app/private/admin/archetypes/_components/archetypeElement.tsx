import { CalendarRange, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Archetype } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import EditArchetype from "./editArchetype";
import { pluralHelper } from "@/lib/utils";

interface AdminArchetypeElementProps {
	archetype: Archetype & { interested: number; events: number };
}

const AdminArchetypeElement = ({ archetype }: AdminArchetypeElementProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{archetype.name}</CardTitle>
			</CardHeader>
			<CardContent className="truncate max-h-[1em] mb-2">{archetype.description}</CardContent>
			<CardFooter className="flex justify-between flex-wrap gap-3">
				<div className="flex gap-3">
					<Badge className="bg-yellow-500 text-black">
						<ThumbsUp />
						{archetype.interested} {pluralHelper(archetype.interested, "zájemce", "zájemci", "zájemců")}
					</Badge>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Badge
									variant="outline"
									className="cursor-pointer">
									<CalendarRange />
									{archetype.events} {pluralHelper(archetype.events, "přednáška", "přednášky", "přednášek")}
								</Badge>
							</TooltipTrigger>
							<TooltipContent>Upravit</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<EditArchetype archetype={archetype} />
			</CardFooter>
		</Card>
	);
};

export default AdminArchetypeElement;
