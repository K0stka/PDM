import { Archetype, Block, Event, Place, User } from "@/lib/types";
import { asc, blocks, db, events, places as placesTable } from "@/db";

import { NextPage } from "next";
import PlacesClientPage from "./_components/clientPage";

export type EditPlaceInfo = Place & {
    events: {
        id: Event["id"];
        archetype: Pick<Archetype, "name">;
        block: Pick<Block, "from" | "to">;
        capacity: Event["capacity"];
        presenters: {
            user: Pick<User, "name">;
        }[];
    }[];
};

const PlacesPage: NextPage = async () => {
    const places: EditPlaceInfo[] = await db.query.places.findMany({
        with: {
            events: {
                columns: {
                    id: true,
                    capacity: true,
                },
                with: {
                    archetype: {
                        columns: {
                            name: true,
                        },
                    },
                    block: {
                        columns: {
                            from: true,
                            to: true,
                        },
                    },
                    presenters: {
                        columns: {},
                        with: {
                            user: {
                                columns: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: asc(events.capacity),
            },
        },
        orderBy: asc(placesTable.name),
    });

    return <PlacesClientPage places={places} />;
};

export default PlacesPage;
