import { CalendarRange, Pencil, ThumbsUp, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Archetype } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { deleteArchetype } from "@/actions/archetype";
import { pluralHelper } from "@/lib/utils";
import { useServerAction } from "@/hooks/use-server-action";

interface AdminArchetypeElementProps {
    archetype: Archetype & { interested: number; events: number };
    onEditArchetype: (
        archetype: Archetype & { interested: number; events: number },
    ) => void;
    onEditEvents: (archetypeId: Archetype["id"]) => void;
}

const AdminArchetypeElement = ({
    archetype,
    onEditArchetype,
    onEditEvents,
}: AdminArchetypeElementProps) => {
    const { action: deleteAction, pending: isDeleting } = useServerAction({
        action: deleteArchetype,
        successToast: "Typ přednášky byl úspěšně odstraněn",
        loadingToast: "Probíhá odstraňování typu přednášky",
        errorToastTitle: "Při odstraňování typu přednášky došlo k chybě",
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{archetype.name}</CardTitle>
            </CardHeader>
            <CardContent className="mb-2 truncate text-nowrap text-muted-foreground">
                {archetype.description}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-3">
                <div className="flex gap-3">
                    <Badge className="bg-yellow-500 text-black">
                        <ThumbsUp />
                        {archetype.interested}{" "}
                        {pluralHelper(
                            archetype.interested,
                            "zájemce",
                            "zájemci",
                            "zájemců",
                        )}
                    </Badge>
                    <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => onEditEvents(archetype.id)}
                    >
                        <CalendarRange />
                        {archetype.events}{" "}
                        {pluralHelper(
                            archetype.events,
                            "přednáška",
                            "přednášky",
                            "přednášek",
                        )}
                        <Pencil className="ml-3" />
                    </Badge>
                </div>
                <div className="flex gap-3">
                    {archetype.events === 0 && (
                        <ServerActionButton
                            pending={isDeleting}
                            onClick={() => deleteAction(archetype.id)}
                            variant="destructive"
                            size="sm"
                        >
                            <Trash2 />
                            Smazat
                        </ServerActionButton>
                    )}
                    <Button
                        onClick={() => onEditArchetype(archetype)}
                        variant="outline"
                        size="sm"
                    >
                        <Pencil />
                        Upravit
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AdminArchetypeElement;
