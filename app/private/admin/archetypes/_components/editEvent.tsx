"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { EditEventDetails } from "@/actions/events";
import { fetchWithServerAction } from "@/hooks/use-server-action";
import { getPossiblePlacesForEvent } from "@/actions/place";
import { printTime } from "@/lib/utils";
import { useState } from "react";

interface EditEventProps {
	event?: EditEventDetails;
	cancelCreateNew?: () => void;
}

const EditEvent = ({ event, cancelCreateNew }: EditEventProps) => {
	const [isEditing, setIsEditing] = useState(!event);

	const [block, setBlock] = useState(event?.block ?? null);
	const [place, setPlace] = useState(event?.place ?? null);
	const [capacity, setCapacity] = useState(event?.capacity ?? 0);
	const [presenters, setPresenters] = useState(event?.presenters ?? []);

	const { data: possiblePlaces, refresh: refreshPossiblePlaces } = fetchWithServerAction({
		action: () => (block ? getPossiblePlacesForEvent(block.id) : Promise.resolve(null)),
		initial: null,
	});

	return (
		<Card>
			{isEditing ? (
				<></>
			) : event ? (
				<>
					<CardHeader>
						<CardTitle>
							{printTime(event.block.from)} - {printTime(event.block.to)}
						</CardTitle>
					</CardHeader>
					<CardFooter></CardFooter>
				</>
			) : (
				"Error"
			)}
		</Card>
	);
};

export default EditEvent;
