"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Event, User } from "@/lib/types";
import { GraduationCap, MapPin, Trash2, Users } from "lucide-react";

import Avatar from "@/components/Avatar";
import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import ServerActionButton from "@/components/utility/ServerActionButton";

interface EventDetailsProps {
    event: Omit<Event, "archetype" | "block"> & {
        archetype: number;
        block: number;
        presenters: { user: Pick<User, "name"> }[];
        attendances: {
            user: Pick<User, "id" | "name" | "colors">;
        }[];
    };
}

const EventDetails = ({ event }: EventDetailsProps) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Card className="my-1 flex flex-col gap-1 p-2 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin />
                        {event.place.name}
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap />
                        {event.presenters.map((p) => p.user.name).join(", ")}
                        {event.presenters.length === 0 && "-"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Users />
                        {event.attending} / {event.capacity}
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="inline-flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin />
                                {event.place.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap />
                                {event.presenters
                                    .map((p) => p.user.name)
                                    .join(", ")}
                                {event.presenters.length === 0 && "-"}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users />
                                {event.attending} / {event.capacity}
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Separator />
                {event.attendances.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        Do této přednášky ještě nejsou přiřazeni žádní účastníci
                    </div>
                )}
                {event.attendances.map(({ user }) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Avatar user={user} />
                            {user.name}
                        </div>
                        <ServerActionButton
                            variant="destructive"
                            size="icon"
                            pending={false}
                        >
                            <Trash2 />
                        </ServerActionButton>
                    </div>
                ))}
                {/* <DialogFooter></DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
};

export default EventDetails;
