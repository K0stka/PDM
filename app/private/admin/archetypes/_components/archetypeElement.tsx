import { CalendarRange, Pencil, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Archetype } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pluralHelper } from "@/lib/utils";

interface AdminArchetypeElementProps {
	archetype: Archetype & { interested: number; events: number };
	onEditArchetype: (archetype: Archetype & { interested: number; events: number }) => void;
	onEditEvents: (archetypeId: { id: Archetype["id"]; numberOfEvents: number }) => void;
}

const AdminArchetypeElement = ({ archetype, onEditArchetype, onEditEvents }: AdminArchetypeElementProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{archetype.name}</CardTitle>
			</CardHeader>
			<CardContent className="truncate text-nowrap mb-2 text-muted-foreground">{archetype.description}</CardContent>
			<CardFooter className="flex justify-between flex-wrap gap-3">
				<div className="flex gap-3">
					<Badge className="bg-yellow-500 text-black">
						<ThumbsUp />
						{archetype.interested} {pluralHelper(archetype.interested, "zájemce", "zájemci", "zájemců")}
					</Badge>
					<Badge
						variant="outline"
						className="cursor-pointer"
						onClick={() => onEditEvents({ id: archetype.id, numberOfEvents: archetype.events })}>
						<CalendarRange />
						{archetype.events} {pluralHelper(archetype.events, "přednáška", "přednášky", "přednášek")}
						<Pencil className="ml-3" />
					</Badge>
				</div>
				<Button
					onClick={() => onEditArchetype(archetype)}
					variant="outline"
					size="sm">
					<Pencil />
					Upravit
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AdminArchetypeElement;
