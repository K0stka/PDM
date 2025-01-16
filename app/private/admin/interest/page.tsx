import { archetypes as archetypesTable, asc, count, db, desc, eq, getTableColumns, interests } from "@/db";

import { Card } from "@/components/ui/card";
import InterestChart from "./_components/chart";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const InterestPage: NextPage = async () => {
	const archetypes = await db
		.select({
			name: archetypesTable.name,
			interested: count(interests.id),
		})
		.from(archetypesTable)
		.leftJoin(interests, eq(archetypesTable.id, interests.archetype))
		.groupBy(archetypesTable.id)
		.orderBy(desc(count(interests.id)), asc(archetypesTable.name));

	return (
		<PageTemplate title="Průzkum zájmu">
			<Card className="p-2">
				<InterestChart archetypes={archetypes} />
			</Card>
		</PageTemplate>
	);
};

export default InterestPage;
