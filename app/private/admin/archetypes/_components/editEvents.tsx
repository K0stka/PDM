"use client";

import { Archetype, Block } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import EditEvent from "./editEvent";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { catchUserError } from "@/lib/utils";
import { fetchWithServerAction } from "@/hooks/use-server-action";
import { getArchetypeEvents } from "@/actions/events";
import { toast } from "sonner";

interface EditEventProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    archetype: { id: Archetype["id"]; numberOfEvents: number };
    blocks: Block[];
}

const EditEvents = ({
    archetype,
    open,
    onOpenChange,
    blocks,
}: EditEventProps) => {
    const [createNew, setCreateNew] = useState(false);
    const {
        data: events,
        returningInitial: updatingEvents,
        refresh: updateEvents,
    } = fetchWithServerAction({
        action: async (archetypeId: Archetype["id"]) => {
            const response = await getArchetypeEvents(archetypeId);

            const [events, error] = catchUserError(response);

            if (error) {
                toast.error("Nepodařilo se načíst přednášky", {
                    description: error.message,
                });

                return [];
            }

            return events;
        },
        initial: [],
        initialArgs: [archetype.id],
    });

    useEffect(() => {
        updateEvents(archetype.id);
    }, [archetype]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-dvh overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upravit přednášky</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                {createNew && (
                    <EditEvent
                        archetypeId={archetype.id}
                        blocks={blocks}
                        cancelCreateNew={() => setCreateNew(false)}
                        onSave={() => updateEvents(archetype.id)}
                    />
                )}
                {archetype.numberOfEvents === 0 && !createNew ? (
                    <div className="my-8 text-center text-sm text-muted-foreground">
                        Ještě nebyly vytvořeny žádné přednášky
                    </div>
                ) : !updatingEvents ? (
                    events.map((event) => (
                        <EditEvent
                            archetypeId={archetype.id}
                            blocks={blocks}
                            key={event.id}
                            event={event}
                            onSave={() => updateEvents(archetype.id)}
                        />
                    ))
                ) : (
                    [...Array(archetype.numberOfEvents).keys()].map((id) => (
                        <Skeleton className="h-20 rounded" key={id} />
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
