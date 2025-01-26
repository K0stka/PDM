import { asc, blocks as blocksTable, db } from "@/db";

import { Block } from "@/lib/types";
import BlocksClientPage from "./_components/clientPage";
import { NextPage } from "next";

export type EditBlockInfo = Block & {
    freeSpace: number;
    capacity: number;
    events: number;
};

const BlocksPage: NextPage = async () => {
    const data = await db.query.blocks.findMany({
        with: {
            archetypeLookup: true,
        },
        orderBy: asc(blocksTable.from),
    });

    const blocks: EditBlockInfo[] = data.map((block) => ({
        id: block.id,
        from: block.from,
        to: block.to,
        freeSpace: block.archetypeLookup.reduce(
            (acc, lookup) => acc + lookup.freeSpace,
            0,
        ),
        capacity: block.archetypeLookup.reduce(
            (acc, event) => acc + event.capacity,
            0,
        ),
        events: block.archetypeLookup.reduce(
            (acc, lookup) => acc + (lookup.capacity > 0 ? 1 : 0),
            0,
        ),
    }));

    return <BlocksClientPage blocks={blocks} />;
};

export default BlocksPage;
