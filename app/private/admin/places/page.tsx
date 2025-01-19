import { Archetype, Block, Place, User } from "@/lib/types";
import { asc, db, places as placesTable } from "@/db";

import { NextPage } from "next";
import PlacesClientPage from "./_components/clientPage";

export type EditPlaceInfo = Place & {
	events: {
		archetype: Pick<Archetype, "name">;
		block: Pick<Block, "from" | "to">;
		presenters: {
			user: Pick<User, "id" | "name" | "colors">;
		}[];
	}[];
};

const PlacesPage: NextPage = async () => {
	const places: EditPlaceInfo[] = await db.query.places.findMany({
		with: {
			events: {
				columns: {},
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
									id: true,
									name: true,
									colors: true,
								},
							},
						},
					},
				},
			},
		},
		orderBy: asc(placesTable.name),
	});

	return <PlacesClientPage places={places} />;
};

export default PlacesPage;
