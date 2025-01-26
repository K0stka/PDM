import {
    interests as Interests,
    archetypes as archetypesTable,
    countDistinct,
    db,
    eq,
    events,
    getTableColumns,
} from "@/db";
import { canUserExpressInterest, interestsActive } from "@/validation/interest";

import { Card } from "@/components/ui/card";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import SharedArchetypeElement from "./_components/archetypeElement";
import { configuration } from "@/configuration/configuration";
import { session } from "@/auth/session";

const WorkshopsPage: NextPage = async () => {
    const user = await session();

    const archetypes = await db
        .select({
            ...getTableColumns(archetypesTable),
            events: countDistinct(events.id),
        })
        .from(archetypesTable)
        .leftJoin(events, eq(archetypesTable.id, events.archetype))
        .groupBy(archetypesTable.id)
        .orderBy(archetypesTable.name);

    const interests = user.isAttending
        ? (
              await db.query.interests.findMany({
                  where: eq(Interests.user, user.id),
                  columns: {
                      archetype: true,
                  },
              })
          ).map((interest) => interest.archetype)
        : [];

    return (
        <PageTemplate title="Anotace přednášek">
            <div className="flex flex-col gap-5">
                {interestsActive() && user.isAttending && (
                    <Card className="p-5 text-muted-foreground">
                        {configuration.interestsCTA}
                    </Card>
                )}
                {archetypes.map((archetype) => (
                    <SharedArchetypeElement
                        key={archetype.id}
                        archetype={archetype}
                        isInterested={interests.includes(archetype.id)}
                        canExpressInterest={canUserExpressInterest(
                            user,
                            interests.length,
                        )}
                    />
                ))}
            </div>
        </PageTemplate>
    );
};

export default WorkshopsPage;
