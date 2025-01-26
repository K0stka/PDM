"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    recalculateAll,
    recalculateArchetypeInterested,
    recalculateBlockArchetypeLookup,
    recalculateEventAttending,
} from "@/actions/lookup";

import ServerActionButton from "@/components/utility/ServerActionButton";
import { TriangleAlert } from "lucide-react";
import { useServerAction } from "@/hooks/use-server-action";

const ClientUtilityPage = () => {
    const { action: archetypeInterested, pending: archetypeInterestedPending } =
        useServerAction({
            action: recalculateArchetypeInterested,
            successToast: "Mezivýpočty úspěšně obnoveny",
            loadingToast: "Obnovování mezivýpočtů",
            errorToastTitle: "Při obnovování mezivýpočtů došlo k chybě",
        });

    const { action: eventAttending, pending: eventAttendingPending } =
        useServerAction({
            action: recalculateEventAttending,
            successToast: "Mezivýpočty úspěšně obnoveny",
            loadingToast: "Obnovování mezivýpočtů",
            errorToastTitle: "Při obnovování mezivýpočtů došlo k chybě",
        });

    const {
        action: blockArchetypeLookup,
        pending: blockArchetypeLookupPending,
    } = useServerAction({
        action: recalculateBlockArchetypeLookup,
        successToast: "Mezivýpočty úspěšně obnoveny",
        loadingToast: "Obnovování mezivýpočtů",
        errorToastTitle: "Při obnovování mezivýpočtů došlo k chybě",
    });

    const { action: all, pending: allPending } = useServerAction({
        action: recalculateAll,
        successToast: "Mezivýpočty úspěšně obnoveny",
        loadingToast: "Obnovování mezivýpočtů",
        errorToastTitle: "Při obnovování mezivýpočtů došlo k chybě",
    });

    return (
        <div className="flex w-full flex-col gap-4">
            <Alert variant="destructive">
                <TriangleAlert className="size-4" />
                <AlertTitle>Upozornění</AlertTitle>
                <AlertDescription>
                    Pokud přesně nerozumíte, co následující možnosti dělají,
                    nejsou určená pro vás, <b>nepoužívejte je</b>. Mohlo by
                    dojít ke <b>korupci dat.</b>
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                    <CardTitle>Cache</CardTitle>
                    <CardDescription>
                        Předem vypočítané a uložené mezivýsledky, které slouží k
                        urychlení ostatních operací. V případě nesrovnalostí je
                        doporučeno vynutit obnovení těchto tabulek.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-end gap-3">
                    <ServerActionButton
                        pending={archetypeInterestedPending}
                        onClick={archetypeInterested}
                    >
                        Zájem o přednášky
                    </ServerActionButton>
                    <ServerActionButton
                        pending={eventAttendingPending}
                        onClick={eventAttending}
                    >
                        Účastníci přednášek
                    </ServerActionButton>
                    <ServerActionButton
                        pending={blockArchetypeLookupPending}
                        onClick={blockArchetypeLookup}
                    >
                        Přihlášky do přednášek
                    </ServerActionButton>
                    <ServerActionButton pending={allPending} onClick={all}>
                        Vše
                    </ServerActionButton>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientUtilityPage;
