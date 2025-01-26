"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import UserRow from "./userRow";
import { Users } from "lucide-react";

interface CellProps {
    lookup: {
        id: number;
        block: number;
        archetype: number;
        freeSpace: number;
        capacity: number;
    };
    claims: {
        id: number;
        block: number;
        secondary: boolean;
        user: {
            id: number;
            name: string;
            colors: {
                light: string;
                dark: string;
            };
        };
    }[];
}

const Cell = ({ lookup, claims }: CellProps) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Card className="my-1 flex flex-col gap-1 p-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Users />
                        {lookup.capacity - lookup.freeSpace} / {lookup.capacity}
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="inline-flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <Users />
                                {lookup.capacity - lookup.freeSpace} /{" "}
                                {lookup.capacity}
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Separator />
                <b>Jako primární</b>
                {claims
                    .filter((c) => !c.secondary)
                    .map((claim) => (
                        <UserRow key={claim.id} claim={claim} />
                    ))}
                <Separator />
                <b>Jako sekundární</b>
                {claims
                    .filter((c) => c.secondary)
                    .map((claim) => (
                        <UserRow key={claim.id} claim={claim} />
                    ))}
                {/* <DialogFooter></DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
};

export default Cell;
