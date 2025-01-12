import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Archetype } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import InterestButton from "./interestButton";
import { ThumbsUp } from "lucide-react";
import { configuration } from "@/configuration/configuration";
import { pluralHelper } from "@/lib/utils";

interface SharedArchetypeElementProps {
	archetype: Archetype & { interested: number; events: number };
	canExpressInterest?: boolean;
	isInterested?: boolean;
}

const SharedArchetypeElement = ({ archetype, canExpressInterest, isInterested }: SharedArchetypeElementProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{archetype.name}</CardTitle>
			</CardHeader>
			<CardContent className="whitespace-pre-line">{archetype.description}</CardContent>
			{configuration.collectInterest && (
				<CardFooter className="flex justify-between flex-wrap gap-3">
					<Badge className="bg-yellow-500 text-black">
						<ThumbsUp />
						{archetype.interested} {pluralHelper(archetype.interested, "zájemce", "zájemci", "zájemců")}
					</Badge>
					{(canExpressInterest || isInterested) && (
						<InterestButton
							archetypeId={archetype.id}
							isInterested={isInterested}
						/>
					)}
				</CardFooter>
			)}
		</Card>
	);
};

export default SharedArchetypeElement;
