"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditEventDetails, getArchetypeEvents } from "@/actions/events";
import { useEffect, useState } from "react";

import { Archetype } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";
import EditEvent from "./editEvent";
import { Plus } from "lucide-react";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { editArchetype } from "@/actions/archetype";
import { getUserError } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";

interface EditEventProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	archetype: { id: Archetype["id"]; numberOfEvents: number };
}

const EditEvents = ({ archetype, open, onOpenChange }: EditEventProps) => {
	const [events, setEvents] = useState<EditEventDetails[] | null>(null);
	const [createNew, setCreateNew] = useState(false);

	useEffect(() => {
		setEvents(null);

		getArchetypeEvents(archetype.id).then((result) => {
			const [events, message] = getUserError(result);

			if (message)
				toast.error("Nastala chyba", {
					description: message.message,
				});
			else setEvents(events);
		});
	}, [archetype]);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upravit přednášky</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				{createNew && <EditEvent cancelCreateNew={() => setCreateNew(false)} />}
				{archetype.numberOfEvents === 0 && !createNew ? (
					<div className="text-sm text-muted-foreground text-center my-8">Ještě nebyly vytvořeny žádné přednášky</div>
				) : events ? (
					events.map((event) => (
						<EditEvent
							key={event.id}
							event={event}
						/>
					))
				) : (
					[...Array(archetype.numberOfEvents).keys()].map((id) => (
						<Skeleton
							className="h-20 rounded"
							key={id}
						/>
					))
				)}
				<DialogFooter>
					<Button onClick={() => setCreateNew(true)}>
						<Plus /> Přidat přednášku
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditEvents;
