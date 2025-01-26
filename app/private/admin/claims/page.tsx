import { archetypes as Archetypes, blocks as Blocks, asc, db } from "@/db";

import Cell from "./_components/cell";
import { Fragment } from "react";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { getBlockName } from "@/validation/block";

const ClaimsPage: NextPage = async () => {
    const archetypes = await db.query.archetypes.findMany({
        orderBy: asc(Archetypes.name),
        with: {
            blockLookup: true,
            claims: {
                columns: {
                    id: true,
                    block: true,
                    secondary: true,
                },
                with: {
                    user: {
                        columns: {
                            id: true,
                            name: true,
                            colors: true,
                        },
                    },
                },
            },
        },
    });

    const blocks = await db.query.blocks.findMany({
        orderBy: Blocks.from,
    });

    return (
        <PageTemplate title="Správa voleb">
            <div
                className="width-full grid items-center justify-items-center overflow-auto rounded-2xl"
                style={{
                    gridTemplateColumns:
                        "max-content" + " 1fr".repeat(blocks.length),
                }}
            >
                <span className="size-full bg-primary" />
                {blocks.map((block) => (
                    <div
                        className="size-full text-nowrap bg-primary p-4 text-center font-bold text-primary-foreground"
                        key={block.id}
                    >
                        {getBlockName(block)}
                    </div>
                ))}
                {archetypes.map((archetype) => (
                    <Fragment key={archetype.id}>
                        <div className="flex size-full max-w-80 items-center truncate text-nowrap bg-secondary px-4 py-2 text-secondary-foreground">
                            {archetype.name}
                        </div>
                        {blocks.map((block) => (
                            <Cell
                                key={block.id}
                                lookup={
                                    archetype.blockLookup.find(
                                        (l) => l.block === block.id,
                                    )!
                                }
                                claims={archetype.claims.filter(
                                    (c) => c.block === block.id,
                                )}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </PageTemplate>
    );
};

export default ClaimsPage;
