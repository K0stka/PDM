"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Archetype } from "@/lib/types";
import { AutosizeTextarea } from "@/components/ui/autosizeTextarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { ZodError } from "zod";
import { editArchetype } from "@/actions/archetype";
import { editArchetypeSchema } from "@/validation/archetype";
import { inlineCatch } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import { useState } from "react";

interface EditArchetypeProps {
	archetype: Archetype;
}

const EditArchetype = ({ archetype }: EditArchetypeProps) => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(archetype.name);
	const [description, setDescription] = useState(archetype.description);

	const { action, pending } = useServerAction({
		action: editArchetype,
		loadingToast: "Ukládání změn...",
		successToast: "Změny byly úspěšně uloženy",
		errorToastTitle: "Při ukládání změn došlo k chybě",
		onSuccess: () => setOpen(false),
	});

	const onSubmit = async () => {
		const [validated, error] = inlineCatch(() => editArchetypeSchema.parse({ id: archetype.id, name, description }));

		if (error)
			return toast.error("Některá pole nejsou správně vyplněna", {
				description: (error as ZodError).errors[0].message,
			});

		await action(validated);
	};

	const onReset = () => {
		setName(archetype.name);
		setDescription(archetype.description);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					onClick={onReset}
					variant="outline"
					size="sm">
					<Pencil />
					Upravit
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upravit přednášku</DialogTitle>
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
		</Dialog>
	);
};

export default EditArchetype;
