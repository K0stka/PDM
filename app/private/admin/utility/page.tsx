import { claims, count, db, desc, eq, users } from "@/db";

import ClientUtilityPage from "./_components/clientPage";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const UtilityPage: NextPage = async () => {
    const claimsPerUser = await db
        .select({
            id: users.id,
            user: users.name,
            claims: count(claims.id),
        })
        .from(users)
        .where(eq(users.isAttending, true))
        .leftJoin(claims, eq(claims.user, users.id))
        .orderBy(desc(count(claims.id)))
        .groupBy(users.id);

    const claimsPerUserFrequency: { [key: number]: number } = {};

    claimsPerUser.forEach((row) => {
        claimsPerUserFrequency[row.claims] =
            (claimsPerUserFrequency[row.claims] ?? 0) + 1;
    });

    const attendees = await db.query.users.findMany({
        columns: {
            id: true,
            name: true,
        },
        where: eq(users.isAttending, true),
        orderBy: users.name,
    });

    return (
        <PageTemplate title="Nástroje">
            <ClientUtilityPage
                claimsPerUser={claimsPerUser}
                claimsPerUserFrequency={claimsPerUserFrequency}
                attendees={attendees}
            />
        </PageTemplate>
    );
};

export default UtilityPage;
