"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditEventDetails, getArchetypeEvents } from "@/actions/events";
import { useEffect, useState } from "react";

import { Archetype } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";
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

	const { action, pending } = useServerAction({
		action: editArchetype,
		loadingToast: "Ukládání změn...",
		successToast: "Změny byly úspěšně uloženy",
		errorToastTitle: "Při ukládání změn došlo k chybě",
		onSuccess: () => onOpenChange(false),
	});

	const onSubmit = async () => {
		// await action(validated);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upravit přednášky</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				{archetype.numberOfEvents === 0 ? (
					<div className="text-sm text-muted-foreground text-center my-8">Ještě nebyly vytvořeny žádné přednášky</div>
				) : events ? (
					events.map((event) => <Card key={event.id}></Card>)
				) : (
					[...Array(archetype.numberOfEvents).keys()].map((id) => (
						<Skeleton
							className="h-20 rounded"
							key={id}
						/>
					))
				)}
				<DialogFooter>
					<Button>
						<Plus /> Přidat přednášku
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditEvents;
