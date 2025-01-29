"use client";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import ServerActionButton from "@/components/utility/ServerActionButton";
import { configuration } from "@/configuration/configuration";
import { setWillAttend } from "@/actions/accountSetup";
import { useServerAction } from "@/hooks/use-server-action";

const NotAttendingClientPage = () => {
    const { action, pending } = useServerAction({
        action: setWillAttend,
        loadingToast: "Ukládání...",
        successToast: "Informace byly uloženy",
        errorToastTitle: "Nastala chyba při ukládání informací",
        onSuccess: () => window.location.reload(),
    });

    return (
        <Card className="mx-4">
            <CardHeader>
                <CardTitle>Nejste účastníkem...</CardTitle>
                <CardDescription>
                    Děkujeme, že jste nám tuto informaci předali a neblokujete
                    místa v přednáškách ostatním zájemcům.
                </CardDescription>
            </CardHeader>
            {configuration.closeClaimsOn.getTime() > Date.now() && (
                <CardFooter>
                    <ServerActionButton
                        pending={pending}
                        onClick={() => action(true)}
                    >
                        Chci se zúčastnit
                    </ServerActionButton>
                </CardFooter>
            )}
        </Card>
    );
};

export default NotAttendingClientPage;
