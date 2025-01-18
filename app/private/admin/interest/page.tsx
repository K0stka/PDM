import { archetypes as archetypesTable, asc, count, db, desc, eq, interests } from "@/db";

import { Card } from "@/components/ui/card";
import { Fragment } from "react";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { Progress } from "@/components/ui/progress";

const InterestPage: NextPage = async () => {
	const archetypes = await db
		.select({
			id: archetypesTable.id,
			name: archetypesTable.name,
			interested: count(interests.id),
		})
		.from(archetypesTable)
		.leftJoin(interests, eq(archetypesTable.id, interests.archetype))
		.groupBy(archetypesTable.id)
		.orderBy(desc(count(interests.id)), asc(archetypesTable.name));

	return (
		<PageTemplate title="Průzkum zájmu">
			<Card className="p-4">
				{archetypes.length === 0 || archetypes[0].interested === 0 ? (
					<div className="size-full flex items-center justify-center text-muted-foreground">Ještě nemáme žádná data</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-[2fr,min-content,1fr] gap-2">
						<b>Název dílny</b>
						<b className="text-center whitespace-nowrap">Počet zájemců</b>
						<span className="hidden md:block"></span>
						{archetypes.map((a) => (
							<Fragment key={a.id}>
								<div className="text-sm truncate">{a.name}</div>
								<div className="text-sm text-gray-500 text-center">{a.interested}</div>
								<Progress
									value={(a.interested * 100) / archetypes[0].interested}
									className="col-span-2 md:col-span-1"
								/>
							</Fragment>
						))}
					</div>
				)}
			</Card>
		</PageTemplate>
	);
};

export default InterestPage;
