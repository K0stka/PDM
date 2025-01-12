"use client";

import AddArchetypeDialog from "./addArchetype";
import { Dialog } from "@/components/ui/dialog";
import PageTemplate from "@/components/utility/PageTemplate";
import { Plus } from "lucide-react";
import { useState } from "react";

interface EditArchetypesClientPageProps {
	archetypes: React.ReactNode[];
}

const EditArchetypesClientPage = ({ archetypes }: EditArchetypesClientPageProps) => {
	const [addArchetypeOpen, setAddArchetypeOpen] = useState(false);

	return (
		<>
			<Dialog
				open={addArchetypeOpen}
				onOpenChange={setAddArchetypeOpen}>
				<AddArchetypeDialog setOpen={setAddArchetypeOpen} />
			</Dialog>
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
				<div className="flex flex-col gap-5">{archetypes}</div>
			</PageTemplate>
		</>
	);
};

export default EditArchetypesClientPage;
