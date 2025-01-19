import { archetypes as archetypesTable, count, db, eq, events, getTableColumns, interests } from "@/db";

import EditArchetypesClientPage from "./_components/clientPage";
import { NextPage } from "next";

const EditArchetypesPage: NextPage = async () => {
	const archetypes = await db
		.select({
			...getTableColumns(archetypesTable),
			interested: count(interests.id),
			events: count(events.id),
		})
		.from(archetypesTable)
		.leftJoin(interests, eq(archetypesTable.id, interests.archetype))
		.leftJoin(events, eq(archetypesTable.id, events.archetype))
		.groupBy(archetypesTable.id)
		.orderBy(archetypesTable.name);

	return <EditArchetypesClientPage archetypes={archetypes} />;
};

export default EditArchetypesPage;
