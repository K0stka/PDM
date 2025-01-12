"use client";

import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { AutosizeTextarea } from "@/components/ui/autosizeTextarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { ZodError } from "zod";
import { addArchetype } from "@/actions/archetype";
import { addArchetypeSchema } from "@/validation/archetype";
import { inlineCatch } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import { useState } from "react";

interface AddArchetypeDialogProps {
	setOpen: SetState<boolean>;
}

const AddArchetypeDialog = ({ setOpen }: AddArchetypeDialogProps) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const { action, pending } = useServerAction({
		action: addArchetype,
		successToast: "Dílna byla úspěšně přidána",
		errorToastTitle: "Při přidávání dílny došlo k chybě",
		loadingToast: "Přidávání dílny...",
		onSuccess: () => setOpen(false),
	});

	const onSubmit = async () => {
		const [archetype, error] = inlineCatch(() => addArchetypeSchema.parse({ name, description }));

		if (error)
			return toast.error("Některá pole nejsou správně vyplněna", {
				description: (error as ZodError).errors[0].message,
			});

		await action(archetype);
		setName("");
		setDescription("");
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Přidat dílnu</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col space-y-2">
				<Label htmlFor="name">Název</Label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="flex flex-col space-y-2">
				<Label htmlFor="description">Popis</Label>
				<AutosizeTextarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<DialogFooter>
				<ServerActionButton
					pending={pending}
					onClick={onSubmit}>
					Uložit
				</ServerActionButton>
			</DialogFooter>
		</DialogContent>
	);
};

export default AddArchetypeDialog;
