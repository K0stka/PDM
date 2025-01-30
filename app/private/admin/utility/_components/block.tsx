"use client";

import { Block, Event } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AttendanceState } from "@/actions/attendance";
import { ComboBox } from "@/components/ui/combobox";
import { configuration } from "@/configuration/configuration";
import { getBlockName } from "@/validation/block";
import { parseIntOrNull } from "@/lib/utils";

interface BlockElementProps {
    block: AttendanceState[Block["id"]];
    attendance: Event["id"] | null;
    onAttendanceChange: (attendance: Event["id"] | null) => void;
}

const BlockElement = ({
    block,
    attendance,
    onAttendanceChange,
}: BlockElementProps) => {
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
                    placeholder="Nic"
                    className="w-auto"
                    value={attendance?.toString()}
                    onChange={(value) => {
                        const id = parseIntOrNull(value);

                        onAttendanceChange(id);
                    }}
                    values={[
                        {
                            value: "none",
                            label: "Nic",
                        },
                        ...block.events.map((e) => ({
                            value: e.id.toString(),
                            label: `${e.name}`,
                        })),
                    ]}
                />
            </CardContent>
        </Card>
    );
};

export default BlockElement;
