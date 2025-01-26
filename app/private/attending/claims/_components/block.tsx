"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Block } from "@/lib/types";
import { BlockClaims } from "./clientPage";
import { BlocksState } from "@/actions/claim";
import { ComboBox } from "@/components/ui/combobox";
import { configuration } from "@/configuration/configuration";
import { getBlockName } from "@/validation/block";
import { pluralHelper } from "@/lib/utils";

interface BlockElementProps {
    block: BlocksState[Block["id"]];
    claims: BlockClaims[Block["id"]];
    onClaimsChange: (claims: BlockClaims[Block["id"]]) => void;
}

const BlockElement = ({ block, claims, onClaimsChange }: BlockElementProps) => {
    return (
        <Card key={block.id}>
            <CardHeader>
                <CardTitle>{getBlockName(block)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-stretch gap-4">
                {configuration.secondaryClaims && (
                    <b className="-mb-3">Primární přednáška</b>
                )}
                <ComboBox
                    placeholder={
                        configuration.secondaryClaims
                            ? "Prosím vyberte primární přednášku"
                            : "Prosím vyberte přednášku"
                    }
                    className="w-auto"
                    value={claims.primary?.toString()}
                    onChange={(value) => {
                        const id = parseInt(value);

                        onClaimsChange({
                            primary: id,
                            secondary:
                                claims.secondary !== id
                                    ? claims.secondary
                                    : null,
                        });
                    }}
                    values={block.archetypes
                        .filter(
                            (a) => a.spaceLeft > 0 || a.id === claims.primary,
                        )
                        .map((a) => ({
                            value: a.id.toString(),
                            label: `${a.name} - ${pluralHelper(Math.max(a.spaceLeft, 0), "zbývá", "zbývají", "zbývá")} ${Math.max(a.spaceLeft, 0)} ${pluralHelper(Math.max(a.spaceLeft, 0), "místo", "místa", "míst")}`,
                        }))}
                />
                {configuration.secondaryClaims && (
                    <>
                        <b className="-mb-3">Sekundární přednáška</b>
                        <ComboBox
                            placeholder="Prosím vyberte sekundární přednášku"
                            className="w-auto"
                            value={claims.secondary?.toString()}
                            onChange={(value) => {
                                onClaimsChange({
                                    primary: claims?.primary,
                                    secondary: parseInt(value),
                                });
                            }}
                            values={block.archetypes
                                .filter(
                                    (a) =>
                                        a.id !==
                                        (claims?.primary ?? block.primaryClaim),
                                )
                                .map((a) => ({
                                    value: a.id.toString(),
                                    label: a.name,
                                }))}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default BlockElement;
