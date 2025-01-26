"use client";

import Avatar from "@/components/Avatar";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { removeClaim } from "@/actions/claim";
import { useServerAction } from "@/hooks/use-server-action";

interface UserRowProps {
    claim: {
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
    };
}

const UserRow = ({ claim }: UserRowProps) => {
    const { action, pending } = useServerAction({
        action: removeClaim,
        successToast: "Volba byla úspěšně odstraněna",
        errorToastTitle: "Nepodařilo se odstranit volbu",
        loadingToast: "Odebírám volbu...",
    });

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar user={claim.user} />
                {claim.user.name}
            </div>
            <ServerActionButton
                variant="destructive"
                size="icon"
                pending={pending}
                onClick={() => action(claim.id)}
            >
                <Trash2 />
            </ServerActionButton>
        </div>
    );
};

export default UserRow;
