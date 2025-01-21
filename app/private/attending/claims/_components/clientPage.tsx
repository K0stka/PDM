"use client";

import { Block, Claim } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { act, useEffect, useState } from "react";
import { catchUserError, cn, inlineCatch, pluralHelper } from "@/lib/utils";
import {
    fetchWithServerAction,
    useServerAction,
} from "@/hooks/use-server-action";
import { getClaimStatus, saveClaims } from "@/actions/claim";

import { Button } from "@/components/ui/button";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { ZodError } from "zod";
import { configuration } from "@/configuration/configuration";
import { getBlockName } from "@/validation/block";
import { saveClaimsSchema } from "@/validation/claim";
import { setWillAttend } from "@/actions/accountSetup";
import { toast } from "sonner";

export interface BlockClaims {
    primaryClaim:
        | (Pick<Claim, "secondary"> & {
              id: Claim["id"] | null;
              archetype: number;
              block: number;
          })
        | null;
    secondaryClaim:
        | (Pick<Claim, "secondary"> & {
              id: Claim["id"] | null;
              archetype: number;
              block: number;
          })
        | null;
}

interface ClientClaimsProps {
    blocks: (Block & {
        claims: BlockClaims;
    })[];
}

const ClientClaims = ({ blocks }: ClientClaimsProps) => {
    const [claims, setClaims] = useState<{ [key: Block["id"]]: BlockClaims }>(
        {},
    );

    useEffect(() => {
        const initialClaims: { [key: Block["id"]]: BlockClaims } = {};

        blocks.forEach((block) => (initialClaims[block.id] = block.claims));

        setClaims(initialClaims);
    }, [blocks]);

    const setPrimary = (blockId: Block["id"], archetypeId: number) => {
        setClaims((claims) => ({
            ...claims,
            [blockId]: {
                primaryClaim: {
                    id: null,
                    archetype: archetypeId,
                    block: blockId,
                    secondary: false,
                },
                secondaryClaim: null,
            },
        }));
    };

    const setSecondary = (blockId: Block["id"], archetypeId: number) => {
        setClaims((claims) => ({
            ...claims,
            [blockId]: {
                ...claims[blockId],
                secondaryClaim: {
                    id: null,
                    archetype: archetypeId,
                    block: blockId,
                    secondary: true,
                },
            },
        }));
    };

    const { action: saveAction, pending: saving } = useServerAction({
        action: saveClaims,
        successToast: "Přihlášení do přednášek bylo úspěšné",
        errorToastTitle: "Nepodařilo se přihlásit do přednášek",
        loadingToast: "Ukládání přihlášek...",
    });

    const save = async () => {
        if (
            blocks.some(
                (block) =>
                    claims[block.id].primaryClaim === null ||
                    claims[block.id].secondaryClaim === null,
            )
        ) {
            toast.error("Nepodařilo se odeslat přihlášky", {
                description: "Chybí některé bloky",
            });

            return;
        }

        const [data, error] = inlineCatch(() =>
            saveClaimsSchema.parse(blocks.map((block) => claims[block.id])),
        );

        if (error) {
            toast.error("Nepodařilo se odeslat přihlášky", {
                description: (error as ZodError).message,
            });

            return;
        }

        await saveAction(data);
    };

    const { action: wontAttend, pending: wontAttendPending } = useServerAction({
        action: () => setWillAttend(false),
        successToast: "Účast byla zrušena",
        errorToastTitle: "Nepodařilo se zrušit účast",
        loadingToast: "Rušení účasti...",
        onSuccess: () => window.location.reload(),
    });

    const { data: archetypes, updating } = fetchWithServerAction({
        action: async () => {
            const unsafe = await getClaimStatus();

            const [data, error] = catchUserError(unsafe);

            if (error) {
                toast.error("Nepodařilo se načíst aktuální stav", {
                    description: error.message,
                });

                return [];
            }

            return data;
        },
        initial: [],
        refreshAfter: 60,
    });

    return (
        <div className="flex flex-col gap-4">
            {blocks.map((block) => {
                const blockClaims = claims[block.id];

                return (
                    <Card key={block.id}>
                        <CardHeader>
                            <CardTitle>{getBlockName(block)}</CardTitle>
                            <CardDescription>
                                {configuration.secondaryClaims
                                    ? "Zvolte jednu hlavní a jednu náhradní přednášku"
                                    : "Prosím zvolte přednášku pro daný blok"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {archetypes.map((archetype) => {
                                const freeSpace =
                                    archetype.capacityPerBlock[block.id] -
                                    archetype.claimsPerBlock[block.id];

                                const selectedAsPrimary =
                                    blockClaims.primaryClaim?.archetype ===
                                    archetype.id;
                                const selectedAsSecondary =
                                    blockClaims.secondaryClaim?.archetype ===
                                    archetype.id;

                                return (
                                    <Card
                                        key={archetype.id}
                                        className={cn({
                                            "cursor-pointer": freeSpace > 0,
                                            "cursor-not-allowed":
                                                freeSpace <= 0 &&
                                                !selectedAsPrimary,
                                            "border-yellow-500 bg-yellow-500/70 [&_span]:text-black":
                                                selectedAsPrimary,
                                        })}
                                        onClick={() => {
                                            if (freeSpace <= 0) return;

                                            setPrimary(block.id, archetype.id);
                                        }}
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                <span>{archetype.name}</span>
                                            </CardTitle>
                                            <CardDescription className="flex items-center justify-between">
                                                <span>
                                                    {pluralHelper(
                                                        freeSpace,
                                                        "Zbývá",
                                                        "Zbývají",
                                                        "Zbývá",
                                                    )}{" "}
                                                    {freeSpace}{" "}
                                                    {pluralHelper(
                                                        freeSpace,
                                                        "místo",
                                                        "místa",
                                                        "míst",
                                                    )}
                                                </span>
                                                <Button
                                                    className="disabled:opacity-70"
                                                    variant={
                                                        selectedAsSecondary
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    disabled={
                                                        blockClaims.primaryClaim
                                                            ?.archetype ===
                                                        archetype.id
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setSecondary(
                                                            block.id,
                                                            archetype.id,
                                                        );
                                                    }}
                                                >
                                                    Náhradní
                                                </Button>
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}
            <div className="flex items-center justify-end gap-4">
                <ServerActionButton
                    pending={wontAttendPending}
                    onClick={wontAttend}
                    variant="destructive"
                >
                    Nezúčastním se
                </ServerActionButton>
                <ServerActionButton pending={updating || saving} onClick={save}>
                    Odeslat
                </ServerActionButton>
            </div>
        </div>
    );
};

export default ClientClaims;
