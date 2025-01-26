"use client";

import { Block, User } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    EditEventDetails,
    createNewEvent,
    deleteEvent,
    editEvent,
} from "@/actions/events";
import { MapPin, Pencil, Save, Trash2, Users } from "lucide-react";
import { catchUserError, inlineCatch } from "@/lib/utils";
import { createNewEventSchema, editEventSchema } from "@/validation/events";
import {
    fetchWithServerAction,
    useServerAction,
} from "@/hooks/use-server-action";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiSelect";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { ZodError } from "zod";
import { getBlockName } from "@/validation/block";
import { getPossiblePlacesForEvent } from "@/actions/place";
import { toast } from "sonner";

interface EditEventProps {
    archetypeId: number;
    blocks: Block[];
    event?: EditEventDetails;
    cancelCreateNew?: () => void;
    onSave: () => void;
}

const EditEvent = ({
    archetypeId,
    blocks,
    event,
    cancelCreateNew,
    onSave,
}: EditEventProps) => {
    const [isEditing, setIsEditing] = useState(!event);

    const [block, setBlock] = useState<number | null>(event?.block.id ?? null);
    const [place, setPlace] = useState<number | null>();
    const [capacity, setCapacity] = useState(event?.capacity ?? 0);
    const [presenters, setPresenters] = useState<User["id"][]>();

    const { action: createNew, pending: createNewPending } = useServerAction({
        action: createNewEvent,
        loadingToast: "Ukládání přednášky",
        successToast: "Přednáška byla úspěšně uložena",
        errorToastTitle: "Nastala chyba při ukládání přednášky",
        onSuccess: () => {
            onSave();
            cancelCreateNew?.();
        },
    });

    const { action: edit, pending: editPending } = useServerAction({
        action: editEvent,
        loadingToast: "Ukládání změn",
        successToast: "Změny byly úspěšně uloženy",
        errorToastTitle: "Nastala chyba při ukládání změn",
        onSuccess: () => {
            onSave();
            setIsEditing(false);
        },
    });

    const { action: deleteAction, pending: deletePending } = useServerAction({
        action: deleteEvent,
        successToast: "Přednáška byla úspěšně odstraněna",
        errorToastTitle: "Při odstraňování přednášky došlo k chybě",
        loadingToast: "Odstraňování přednášky",
        onSuccess: onSave,
    });

    const save = async () => {
        if (event) {
            const unsafe = {
                id: event.id,
                archetype: archetypeId,
                block,
                place,
                capacity,
                presenters,
            };

            const [safe, error] = inlineCatch(() =>
                editEventSchema.parse(unsafe),
            );

            if (error) {
                toast.error("Některá pole jsou vyplněná nesprávně", {
                    description: (error as ZodError).issues[0].message,
                });

                return;
            }

            await edit(safe);
        } else {
            const unsafe = {
                archetype: archetypeId,
                block,
                place,
                capacity,
                presenters,
            };

            const [safe, error] = inlineCatch(() =>
                createNewEventSchema.parse(unsafe),
            );

            if (error) {
                toast.error("Některá pole jsou vyplněná nesprávně", {
                    description: (error as ZodError).issues[0].message,
                });

                return;
            }

            await createNew(safe);
        }
    };

    const reset = () => {
        setBlock(event?.block.id ?? null);
        setPlace(event?.place.id ?? null);
        setCapacity(event?.capacity ?? 0);
        setPresenters(event?.presenters.map((p) => p.user.id) ?? []);
    };

    const {
        data: possiblePlaces,
        refresh: refreshPossiblePlaces,
        returningInitial: possiblePlacesUpdating,
    } = fetchWithServerAction({
        action: async (blockId: number | null) => {
            if (blockId === null) return [];

            const [places, message] = catchUserError(
                await getPossiblePlacesForEvent(blockId, event?.id),
            );

            if (message) {
                toast.error("Nastala chyba", {
                    description: message.message,
                });

                return [];
            }

            if (event && !places.find((place) => place.id === event.place.id))
                places.push(event.place);

            return places;
        },
        initial: [],
        initialArgs: [null],
    });

    const {
        data: possiblePresenters,
        refresh: refreshPossiblePresenters,
        returningInitial: possiblePresentersUpdating,
    } = fetchWithServerAction({
        action: async (
            blockId: number | null,
        ): Promise<Pick<User, "id" | "name">[]> => {
            return [];
        },
        initial: [],
        initialArgs: [null],
    });

    useEffect(() => {
        if (!block) return;

        setPlace(place === undefined ? (event?.place.id ?? null) : null);
        setPresenters(
            presenters === undefined
                ? (event?.presenters.map((p) => p.user.id) ?? [])
                : [],
        );

        refreshPossiblePlaces(block);
        refreshPossiblePresenters(block);
    }, [block]);

    return (
        <Card>
            {isEditing ? (
                <>
                    <CardContent className="flex flex-col gap-4 pt-4">
                        <label className="flex flex-col gap-2">
                            <b>Kapacita:</b>
                            <Input
                                type="number"
                                className="input"
                                min={0}
                                value={capacity}
                                onChange={(e) =>
                                    setCapacity(parseInt(e.target.value))
                                }
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <b>Blok:</b>
                            <ComboBox
                                className="w-auto"
                                value={block}
                                onChange={setBlock}
                                values={blocks.map((block) => ({
                                    value: block.id,
                                    label: getBlockName(block),
                                }))}
                            />
                        </label>
                        {block && (
                            <>
                                <label className="flex flex-col gap-2">
                                    <b>Místo:</b>
                                    {!possiblePlacesUpdating ? (
                                        possiblePlaces.length > 0 ? (
                                            <ComboBox
                                                className="w-auto"
                                                value={place}
                                                onChange={setPlace}
                                                values={possiblePlaces.map(
                                                    (p) => ({
                                                        value: p.id,
                                                        label: p.name,
                                                    }),
                                                )}
                                            />
                                        ) : (
                                            <div className="text-center text-sm text-muted-foreground">
                                                V daném bloku již není volné
                                                žádné místo
                                            </div>
                                        )
                                    ) : (
                                        <Skeleton className="h-10 rounded" />
                                    )}
                                </label>
                                <label className="flex flex-col gap-2">
                                    <b>Přednášející:</b>
                                    {!possiblePresentersUpdating ? (
                                        possiblePresenters.length > 0 ? (
                                            <MultiSelect
                                                className="w-auto"
                                                value={presenters ?? []}
                                                onChange={setPresenters}
                                                values={possiblePresenters.map(
                                                    (presenter) => ({
                                                        value: presenter.id,
                                                        label: presenter.name,
                                                    }),
                                                )}
                                            />
                                        ) : (
                                            <div className="text-center text-sm text-muted-foreground">
                                                V daném bloku již není volný
                                                žádný přednášející
                                            </div>
                                        )
                                    ) : (
                                        <Skeleton className="h-10 rounded" />
                                    )}
                                </label>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                                cancelCreateNew?.();
                            }}
                        >
                            Zrušit
                        </Button>
                        <ServerActionButton
                            size="sm"
                            pending={createNewPending || editPending}
                            onClick={save}
                        >
                            <Save />
                            Uložit
                        </ServerActionButton>
                        {event && (
                            <ServerActionButton
                                size="sm"
                                variant="destructive"
                                pending={deletePending}
                                onClick={() => deleteAction(event.id)}
                            >
                                <Trash2 />
                                Smazat
                            </ServerActionButton>
                        )}
                    </CardFooter>
                </>
            ) : event ? (
                <>
                    <CardHeader>
                        <CardTitle className="relative flex items-center justify-between text-lg">
                            {getBlockName(event.block)}
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil />
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            <Users /> Kapacita: {event.capacity}, <MapPin />{" "}
                            Místo: {event.place.name}
                        </CardDescription>
                    </CardHeader>
                </>
            ) : (
                "Error"
            )}
        </Card>
    );
};

export default EditEvent;
