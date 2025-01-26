"use client";

import { Archetype, Claim } from "@/lib/types";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { getBlockName } from "@/validation/block";
import { removeClaim } from "@/actions/claim";
import { useServerAction } from "@/hooks/use-server-action";

interface ClaimRowProps {
    claim: Omit<Claim, "block" | "archetype" | "user"> & {
        block: {
            from: Date;
            to: Date;
        };
        user: number;
        archetype: Pick<Archetype, "name">;
    };
    onRemove: () => void;
}

const ClaimRow = ({ claim, onRemove }: ClaimRowProps) => {
    const { action, pending } = useServerAction({
        action: removeClaim,
        successToast: "Volba byla úspěšně odstraněna",
        errorToastTitle: "Nepodařilo se odstranit volbu",
        loadingToast: "Odebírám volbu...",
        onSuccess: onRemove,
    });

    return (
        <Card className="flex items-center justify-between pr-2 text-sm">
            <CardHeader className="p-2">
                <CardTitle className="text-sm">
                    {claim.archetype.name}
                </CardTitle>
                <CardDescription>
                    {getBlockName(claim.block)} -{" "}
                    {claim.secondary ? "Sekundární" : "Primární"}
                </CardDescription>
            </CardHeader>
            <ServerActionButton
                pending={pending}
                variant="destructive"
                size="icon"
                onClick={() => action(claim.id)}
            >
                <Trash2 />
            </ServerActionButton>
        </Card>
    );
};

export default ClaimRow;
