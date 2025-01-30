"use client";

import { Block, Event, User } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    fetchWithServerAction,
    useServerAction,
} from "@/hooks/use-server-action";
import {
    getAttendanceStateForUserId,
    saveUserAttendances,
} from "@/actions/attendance";
import { useEffect, useState } from "react";

import BlockElement from "./block";
import { ComboBox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { catchUserError } from "@/lib/utils";
import { toast } from "sonner";

interface EditUserProps {
    attendees: Pick<User, "id" | "name">[];
}

export type AttendanceClientState = {
    [key: Block["id"]]: Event["id"] | null;
};

const EditUser = ({ attendees }: EditUserProps) => {
    const [user, setUser] = useState<number | null>(null);

    const [attendancesState, setAttendances] = useState<AttendanceClientState>(
        {},
    );

    // frybortova zmena na demokracii

    const {
        data: attendances,
        returningInitial: attendancesLoading,
        refresh: fetchAttendances,
    } = fetchWithServerAction({
        action: async (userId: number) => {
            const response = await getAttendanceStateForUserId(userId);

            const [data, error] = catchUserError(response);

            if (error) {
                toast.error("Nepodařilo se načíst účasti uživatele", {
                    description: error.message,
                });
                return null;
            }

            const state: typeof attendancesState = {};

            data.forEach((d) => {
                state[d.id] = d.attendance;
            });

            setAttendances(state);

            return data;
        },
        initial: [],
        initialArgs: false,
    });

    const { action: saveAction, pending: savePending } = useServerAction({
        action: saveUserAttendances,
        successToast: "Účasti uživatele byly úspěšně uloženy",
        loadingToast: "Ukládání účastí uživatele",
        errorToastTitle: "Při ukládání účastí uživatele došlo k chybě",
    });

    useEffect(() => {
        if (user) fetchAttendances(user);
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Úprava rozřazení účastníků</CardTitle>
                <CardDescription>
                    Zde lze upravovat, kam jednotliví účastníci jdou.
                    {user}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Label className="flex flex-col gap-2">
                    Uživatel:
                    <ComboBox
                        value={user}
                        values={attendees.map((u) => ({
                            value: u.id,
                            label: u.name,
                        }))}
                        onChange={setUser}
                        className="w-auto"
                    />
                </Label>
                {attendancesLoading ? (
                    <Skeleton className="h-20" />
                ) : (
                    attendances &&
                    attendances.map((b) => (
                        <BlockElement
                            key={b.id}
                            block={b}
                            attendance={attendancesState[b.id]}
                            onAttendanceChange={(eventId) => {
                                setAttendances((prev) => ({
                                    ...prev,
                                    [b.id]: eventId,
                                }));
                            }}
                        />
                    ))
                )}
            </CardContent>
            {user && (
                <CardFooter className="flex flex-wrap items-center justify-end gap-3">
                    <ServerActionButton
                        pending={savePending}
                        onClick={() => saveAction(user!, attendancesState)}
                    >
                        Uložit
                    </ServerActionButton>
                </CardFooter>
            )}
        </Card>
    );
};

export default EditUser;
