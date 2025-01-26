"use client";

import { Archetype, Block } from "@/lib/types";
import {
    fetchWithServerAction,
    useServerAction,
} from "@/hooks/use-server-action";
import { getBlocksState, saveClaims } from "@/actions/claim";

import BlockElement from "./block";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { catchUserError } from "@/lib/utils";
import { configuration } from "@/configuration/configuration";
import { setWillAttend } from "@/actions/accountSetup";
import { toast } from "sonner";
import { useState } from "react";

export interface BlockClaims {
    [key: Block["id"]]: {
        primary: Archetype["id"] | null;
        secondary: Archetype["id"] | null;
    };
}

const ClientClaims = () => {
    const [claims, setClaims] = useState<BlockClaims>({});

    const {
        data: blockState,
        returningInitial: loadingBlockState,
        refresh: refreshData,
    } = fetchWithServerAction({
        action: async (first: boolean) => {
            const response = await getBlocksState();

            const [data, error] = catchUserError(response);

            if (error) {
                toast.error("Při načítání dat došlo k chybě", {
                    description: error.message,
                });

                return [];
            }

            if (first) {
                const blockClaims: BlockClaims = {};

                data.forEach((d) => {
                    blockClaims[d.id] = {
                        primary: d.primaryClaim,
                        secondary: d.secondaryClaim,
                    };
                });

                setClaims(blockClaims);
            }

            return data;
        },
        initial: [],
        initialArgs: [true],
    });

    const { action: saveAction, pending: saving } = useServerAction({
        action: saveClaims,
        successToast: "Volba byla uložena",
        errorToastTitle: "Nepodařilo se uložit volbu",
        loadingToast: "Ukládání volby...",
        onSuccess: () => refreshData(false),
    });

    const save = () => {
        if (blockState.some((b) => claims[b.id].primary === null)) {
            toast.warning("Vyberte primární přednášku pro všechny bloky");

            return;
        }

        if (
            configuration.secondaryClaims &&
            blockState.some((b) => claims[b.id].secondary === null)
        ) {
            toast.warning("Vyberte sekundární přednášku pro všechny bloky");

            return;
        }

        saveAction(
            blockState.map((b) => ({
                block: b.id,
                primaryArchetype: claims[b.id].primary!,
                secondaryArchetype: claims[b.id].secondary ?? undefined,
            })),
        );
    };

    const { action: wontAttend, pending: wontAttendPending } = useServerAction({
        action: () => setWillAttend(false),
        successToast: "Účast byla zrušena",
        errorToastTitle: "Nepodařilo se zrušit účast",
        loadingToast: "Rušení účasti...",
        onSuccess: () => window.location.reload(),
    });

    const updateClaims = (
        blockId: Block["id"],
        newClaims: BlockClaims[number],
    ) => {
        if (
            blockState.some((b) => {
                if (b.id === blockId) return false;

                if (
                    newClaims.primary !== null &&
                    claims[b.id].primary === newClaims.primary
                ) {
                    toast.warning("Nelze vybrat 2 stejné primární přednášky");

                    return true;
                }

                if (
                    newClaims.secondary !== null &&
                    newClaims.secondary === claims[b.id].primary
                ) {
                    toast.warning(
                        "Nelze zvolit stejnou sekundární přednášku jako primární v jiném bloku",
                    );

                    return true;
                }

                if (
                    newClaims.secondary !== null &&
                    newClaims.secondary === claims[b.id].secondary
                ) {
                    toast.warning("Nelze vybrat 2 stejné sekundární přednášky");

                    return true;
                }

                return false;
            })
        )
            return;

        setClaims((oldClaims) => ({
            ...oldClaims,
            [blockId]: newClaims,
        }));
    };

    return (
        <div className="flex flex-col gap-4">
            {!loadingBlockState ? (
                <>
                    {blockState.map((block) => (
                        <BlockElement
                            key={block.id}
                            block={block}
                            claims={claims[block.id]}
                            onClaimsChange={(newClaims) =>
                                updateClaims(block.id, newClaims)
                            }
                        />
                    ))}
                </>
            ) : (
                <>
                    {[0, 1].map((id) => (
                        <Skeleton className="h-64 rounded" key={id} />
                    ))}
                </>
            )}
            <div className="flex items-center justify-end gap-4">
                <ServerActionButton
                    pending={wontAttendPending}
                    onClick={wontAttend}
                    variant="destructive"
                >
                    Nezúčastním se
                </ServerActionButton>
                <ServerActionButton
                    pending={loadingBlockState || saving}
                    onClick={save}
                >
                    Uložit
                </ServerActionButton>
            </div>
        </div>
    );
};

export default ClientClaims;
