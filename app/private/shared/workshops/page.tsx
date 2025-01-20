import {
    archetypes as Archetypes,
    interests as Interests,
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
            ...getTableColumns(Archetypes),
            interested: countDistinct(Interests.id),
            events: countDistinct(events.id),
        })
        .from(Archetypes)
        .leftJoin(Interests, eq(Archetypes.id, Interests.archetype))
        .leftJoin(events, eq(Archetypes.id, events.archetype))
        .groupBy(Archetypes.id)
        .orderBy(Archetypes.name);

    const interests = user.isAttending
        ? await db.query.interests.findMany({
              where: eq(Interests.user, user.id),
              columns: {
                  archetype: true,
              },
          })
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
                        canExpressInterest={canUserExpressInterest(
                            user,
                            interests.length,
                        )}
                        isInterested={interests.some(
                            (interest) => interest.archetype === archetype.id,
                        )}
                    />
                ))}
            </div>
        </PageTemplate>
    );
};

export default WorkshopsPage;
