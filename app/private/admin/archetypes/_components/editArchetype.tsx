"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import { Archetype } from "@/lib/types";
import { AutosizeTextarea } from "@/components/ui/autosizeTextarea";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { ZodError } from "zod";
import { editArchetype } from "@/actions/archetype";
import { editArchetypeSchema } from "@/validation/archetype";
import { inlineCatch } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";

interface EditArchetypeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    archetype:
        | (Archetype & {
              interested: number;
              events: number;
          })
        | null;
}

const EditArchetype = ({
    archetype,
    open,
    onOpenChange,
}: EditArchetypeProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!archetype) return;

        setName(archetype.name);
        setDescription(archetype.description);
    }, [archetype]);

    const { action, pending } = useServerAction({
        action: editArchetype,
        loadingToast: "Ukládání změn...",
        successToast: "Změny byly úspěšně uloženy",
        errorToastTitle: "Při ukládání změn došlo k chybě",
        onSuccess: () => onOpenChange(false),
    });

    const onSubmit = async () => {
        if (!archetype) return;

        const [validated, error] = inlineCatch(() =>
            editArchetypeSchema.parse({ id: archetype.id, name, description }),
        );

        if (error)
            return toast.error("Některá pole nejsou správně vyplněna", {
                description: (error as ZodError).errors[0].message,
            });

        await action(validated);
    };

    if (!archetype) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upravit přednášku</DialogTitle>
                    <DialogDescription />
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
                    <ServerActionButton pending={pending} onClick={onSubmit}>
                        Uložit
                    </ServerActionButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditArchetype;
