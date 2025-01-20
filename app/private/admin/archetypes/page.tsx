import {
    archetypes as archetypesTable,
    asc,
    blocks as blocksTable,
    count,
    countDistinct,
    db,
    eq,
    events,
    getTableColumns,
    interests,
} from "@/db";

import EditArchetypesClientPage from "./_components/clientPage";
import { NextPage } from "next";

const EditArchetypesPage: NextPage = async () => {
    const archetypes = await db
        .select({
            ...getTableColumns(archetypesTable),
            interested: countDistinct(interests.id),
            events: countDistinct(events.id),
        })
        .from(archetypesTable)
        .leftJoin(interests, eq(archetypesTable.id, interests.archetype))
        .leftJoin(events, eq(archetypesTable.id, events.archetype))
        .groupBy(archetypesTable.id)
        .orderBy(archetypesTable.name);

    const blocks = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
    });

    return <EditArchetypesClientPage archetypes={archetypes} blocks={blocks} />;
};

export default EditArchetypesPage;
