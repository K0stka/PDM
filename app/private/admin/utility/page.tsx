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
        .leftJoin(claims, eq(claims.user, users.id))
        .orderBy(desc(count(claims.id)))
        .groupBy(users.id);

    return (
        <PageTemplate title="Nástroje">
            <ClientUtilityPage claimsPerUser={claimsPerUser} />
        </PageTemplate>
    );
};

export default UtilityPage;
