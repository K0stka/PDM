import {
    archetypes as archetypesTable,
    asc,
    count,
    db,
    desc,
    eq,
    interests,
} from "@/db";

import { Card } from "@/components/ui/card";
import { Fragment } from "react";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { Progress } from "@/components/ui/progress";

const InterestPage: NextPage = async () => {
    const archetypes = await db.query.archetypes.findMany({
        columns: {
            id: true,
            name: true,
            interested: true,
        },
        orderBy: [desc(archetypesTable.interested), asc(archetypesTable.name)],
    });

    return (
        <PageTemplate title="Průzkum zájmu">
            <Card className="p-4">
                {archetypes.length === 0 || archetypes[0].interested === 0 ? (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                        Ještě nemáme žádná data
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-[2fr,min-content,1fr]">
                        <b>Název dílny</b>
                        <b className="whitespace-nowrap text-center">
                            Počet zájemců
                        </b>
                        <span className="hidden md:block"></span>
                        {archetypes.map((a) => (
                            <Fragment key={a.id}>
                                <div className="truncate text-sm">{a.name}</div>
                                <div className="text-center text-sm text-gray-500">
                                    {a.interested}
                                </div>
                                <Progress
                                    value={
                                        (a.interested * 100) /
                                        archetypes[0].interested
                                    }
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
