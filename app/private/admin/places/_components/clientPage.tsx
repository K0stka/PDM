"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pencil, Plus, Presentation, Timer, Trash2, Users } from "lucide-react";

import AddPlace from "./addPlace";
import { Button } from "@/components/ui/button";
import DeletePlaceButton from "./deletePlace";
import EditPlace from "./editPlace";
import { EditPlaceInfo } from "../page";
import PageTemplate from "@/components/utility/PageTemplate";
import { Place } from "@/lib/types";
import { getBlockName } from "@/validation/block";
import { useState } from "react";

interface PlacesClientPageProps {
    places: EditPlaceInfo[];
}

const PlacesClientPage = ({ places }: PlacesClientPageProps) => {
    const [addPlaceOpen, setAddPlaceOpen] = useState(false);
    const [editPlaceOpen, setEditPlaceOpen] = useState(false);
    const [editPlace, setEditPlace] = useState<Place | null>(null);

    return (
        <PageTemplate
            title="Správa míst"
            actions={[
                {
                    id: "add",
                    text: "Přidat místo",
                    icon: <Plus />,
                    onClick: () => setAddPlaceOpen(true),
                    props: {
                        variant: "secondary",
                    },
                },
            ]}
        >
            <AddPlace open={addPlaceOpen} onOpenChange={setAddPlaceOpen} />
            {editPlace && (
                <EditPlace
                    open={editPlaceOpen}
                    onOpenChange={setEditPlaceOpen}
                    place={editPlace}
                />
            )}
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {places.map((place) => (
                    <Card key={place.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {place.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {place.events.map((event) => (
                                <Card key={event.id}>
                                    <CardHeader className="p-2">
                                        <CardTitle className="text-base">
                                            {event.archetype.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Timer />
                                            {getBlockName(event.block)}
                                        </CardDescription>
                                        <CardDescription className="flex items-center gap-2">
                                            <Users />
                                            Kapacita: {event.capacity}
                                        </CardDescription>
                                        <CardDescription className="flex flex-wrap items-center gap-2">
                                            <span>
                                                <Presentation />
                                                Přednášející:
                                            </span>
                                            {event.presenters
                                                .map(
                                                    (presenter) =>
                                                        presenter.user.name,
                                                )
                                                .join(", ")}
                                            {event.presenters.length === 0 &&
                                                "-"}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-wrap justify-end gap-2">
                            <DeletePlaceButton place={place} />
                            <Button
                                size="icon"
                                onClick={() => {
                                    setEditPlace(place);
                                    setEditPlaceOpen(true);
                                }}
                            >
                                <Pencil />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </PageTemplate>
    );
};

export default PlacesClientPage;
