"use client";

import AddArchetypeDialog from "./addArchetype";
import AdminArchetypeElement from "./archetypeElement";
import { Archetype } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import EditArchetype from "./editArchetype";
import EditEvents from "./editEvents";
import PageTemplate from "@/components/utility/PageTemplate";
import { Plus } from "lucide-react";
import { useState } from "react";

interface EditArchetypesClientPageProps {
	archetypes: (Archetype & {
		interested: number;
		events: number;
	})[];
}

const EditArchetypesClientPage = ({ archetypes }: EditArchetypesClientPageProps) => {
	const [addArchetypeOpen, setAddArchetypeOpen] = useState(false);
	const [editArchetypeOpen, setEditArchetypeOpen] = useState(false);
	const [editArchetype, setEditArchetype] = useState<(Archetype & { interested: number; events: number }) | null>(null);
	const [editArchetypeEventsOpen, setEditArchetypeEventsOpen] = useState(false);
	const [editArchetypeEvents, setEditArchetypeEvents] = useState<{ id: Archetype["id"]; numberOfEvents: number } | null>(null);

	return (
		<>
			<Dialog
				open={addArchetypeOpen}
				onOpenChange={setAddArchetypeOpen}>
				<AddArchetypeDialog setOpen={setAddArchetypeOpen} />
			</Dialog>
			{editArchetype && (
				<EditArchetype
					open={editArchetypeOpen}
					onOpenChange={setEditArchetypeOpen}
					archetype={editArchetype}
				/>
			)}
			{editArchetypeEvents && (
				<EditEvents
					open={editArchetypeEventsOpen}
					onOpenChange={setEditArchetypeEventsOpen}
					archetype={editArchetypeEvents}
				/>
			)}
			<PageTemplate
				title="Správa přednášek"
				actions={[
					{
						id: "add",
						text: "Přidat přednášku",
						icon: <Plus />,
						props: {
							variant: "secondary",
						},
						onClick: () => setAddArchetypeOpen(true),
					},
				]}>
				<div className="flex flex-col gap-5">
					{archetypes.map((archetype) => (
						<AdminArchetypeElement
							key={archetype.id}
							archetype={archetype}
							onEditArchetype={(archetype) => {
								setEditArchetype(archetype);
								setEditArchetypeOpen(true);
							}}
							onEditEvents={(archetype) => {
								setEditArchetypeEvents(archetype);
								setEditArchetypeEventsOpen(true);
							}}
						/>
					))}
				</div>
			</PageTemplate>
		</>
	);
};

export default EditArchetypesClientPage;
