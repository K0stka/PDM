import { Archetype, Block, Event, User } from "@/lib/types";
import { asc, blocks as blocksTable, db, places as placesTable } from "@/db";

import BlocksClientPage from "./_components/clientPage";
import { NextPage } from "next";

export type EditBlockInfo = Block & {
    capacity: number;
    events: number;
};

const BlocksPage: NextPage = async () => {
    const data = await db.query.blocks.findMany({
        with: {
            events: {
                columns: {
                    capacity: true,
                },
            },
        },
        orderBy: asc(blocksTable.from),
    });

    const blocks: EditBlockInfo[] = data.map((block) => ({
        id: block.id,
        from: block.from,
        to: block.to,
        capacity: block.events.reduce((acc, event) => acc + event.capacity, 0),
        events: block.events.length,
    }));

    return <BlocksClientPage blocks={blocks} />;
};

export default BlocksPage;
