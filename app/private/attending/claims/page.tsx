import ClientClaims, { BlockClaims } from "./_components/clientPage";
import { asc, blocks as blocksTable, claims, db, eq } from "@/db";

import { Block } from "@/lib/types";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { session } from "@/auth/session";

const ClaimsPage: NextPage = async () => {
    const user = await session();

    const currentClaims = await db.query.claims.findMany({
        where: eq(claims.user, user.id),
        columns: {
            id: true,
            block: true,
            archetype: true,
            secondary: true,
        },
    });

    const blocksData = await db.query.blocks.findMany({
        orderBy: asc(blocksTable.from),
    });

    const blocks: (Block & { claims: BlockClaims })[] = blocksData.map((b) => ({
        ...b,
        claims: {
            primaryClaim:
                currentClaims.find((c) => c.block === b.id && !c.secondary) ??
                null,
            secondaryClaim:
                currentClaims.find((c) => c.block === b.id && c.secondary) ??
                null,
        },
    }));

    return (
        <PageTemplate title="Volba přednášek">
            <ClientClaims blocks={blocks} />
        </PageTemplate>
    );
};

export default ClaimsPage;
