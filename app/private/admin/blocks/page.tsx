import { Archetype, Block, Event, User } from "@/lib/types";
import { asc, blocks as blocksTable, db, places as placesTable } from "@/db";

import BlocksClientPage from "./_components/clientPage";
import { NextPage } from "next";

export type EditBlockInfo = Block & {
	events: {
		id: Event["id"];
		capacity: Event["capacity"];
		archetype: Pick<Archetype, "name">;
	}[];
};

const BlocksPage: NextPage = async () => {
	const blocks: EditBlockInfo[] = await db.query.blocks.findMany({
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
				},
			},
		},
		orderBy: asc(blocksTable.from),
	});

	return <BlocksClientPage blocks={blocks} />;
};

export default BlocksPage;
