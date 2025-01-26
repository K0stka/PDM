import { and, count, db, eq, isNotNull, users } from "@/db";

import { Card } from "@/components/ui/card";
import { Fragment } from "react";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { Progress } from "@/components/ui/progress";
import { configuration } from "@/configuration/configuration";

const InterestPage: NextPage = async () => {
    const classes = (await db
        .select({ class: users.class, count: count(users.id) })
        .from(users)
        .where(and(eq(users.isAttending, true), isNotNull(users.class)))
        .groupBy(users.class)) as { class: string; count: number }[];

    let maxUsers = 0;
    const lookupTable: { [key: string]: number } = {};

    classes.forEach((cl) => {
        lookupTable[cl.class] = cl.count;
        if (cl.count > maxUsers) maxUsers = cl.count;
    });

    return (
        <PageTemplate title="Statistika tříd">
            <Card className="p-4">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-[1fr,min-content,2fr]">
                    <b>Třída</b>
                    <b className="col-span-2 whitespace-nowrap text-center md:col-span-1">
                        Počet uživatelů
                    </b>
                    <span className="hidden md:block"></span>
                    {configuration.validClasses.map((c) => (
                        <Fragment key={c}>
                            <div className="truncate text-sm">{c}</div>
                            <div className="col-span-2 text-center text-sm text-gray-500 md:col-span-1">
                                {lookupTable[c] ?? 0}
                            </div>
                            <Progress
                                value={
                                    maxUsers > 0
                                        ? ((lookupTable[c] ?? 0) / maxUsers) *
                                          100
                                        : 0
                                }
                                className="col-span-3 md:col-span-1"
                            />
                        </Fragment>
                    ))}
                </div>
            </Card>
        </PageTemplate>
    );
};

export default InterestPage;
