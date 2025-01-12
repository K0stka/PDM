// Broken

import { archetypes, interests } from "./models";
import { count, eq, getTableColumns } from ".";

import { pgMaterializedView } from "drizzle-orm/pg-core";

// Maybe returns wrong number of interests
export const archetypeInterest = pgMaterializedView("archetype_interest").as((qb) =>
	qb
		.select({
			...getTableColumns(archetypes),
			interested: count(interests.id),
		})
		.from(archetypes)
		.leftJoin(interests, eq(archetypes.id, interests.archetype))
		.groupBy(archetypes.id)
		.orderBy(archetypes.name)
);
