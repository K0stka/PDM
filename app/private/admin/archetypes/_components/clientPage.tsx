"use client";

import { Archetype, Block } from "@/lib/types";

import AddArchetypeDialog from "./addArchetype";
import AdminArchetypeElement from "./archetypeElement";
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
    blocks: Block[];
}

const EditArchetypesClientPage = ({
    archetypes,
    blocks,
}: EditArchetypesClientPageProps) => {
    const [addArchetypeOpen, setAddArchetypeOpen] = useState(false);

    const [editArchetypeOpen, setEditArchetypeOpen] = useState(false);
    const [editArchetype, setEditArchetype] = useState<
        (Archetype & { interested: number; events: number }) | null
    >(null);

    const [editArchetypeEventsOpen, setEditArchetypeEventsOpen] =
        useState(false);
    const [editArchetypeEvents, setEditArchetypeEvents] = useState<
        Archetype["id"] | null
    >(null);

    return (
        <>
            <Dialog open={addArchetypeOpen} onOpenChange={setAddArchetypeOpen}>
                <AddArchetypeDialog setOpen={setAddArchetypeOpen} />
            </Dialog>
            <EditArchetype
                open={editArchetypeOpen}
                onOpenChange={setEditArchetypeOpen}
                archetype={editArchetype}
            />
            <EditEvents
                open={editArchetypeEventsOpen}
                onOpenChange={setEditArchetypeEventsOpen}
                archetype={editArchetypeEvents}
                blocks={blocks}
            />
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
                ]}
            >
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
