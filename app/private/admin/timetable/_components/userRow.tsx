"use client";

import Avatar from "@/components/Avatar";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { useServerAction } from "@/hooks/use-server-action";

interface UserRowProps {
    attendance: {
        id: number;
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

const UserRow = ({ attendance }: UserRowProps) => {
    const { action, pending } = useServerAction({
        action: (id: number) => {},
        successToast: "Volba byla úspěšně odstraněna",
        errorToastTitle: "Nepodařilo se odstranit volbu",
        loadingToast: "Odebírám volbu...",
    });

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar user={attendance.user} />
                {attendance.user.name}
            </div>
            <ServerActionButton
                variant="destructive"
                size="icon"
                pending={pending}
                onClick={() => action(attendance.id)}
            >
                <Trash2 />
            </ServerActionButton>
        </div>
    );
};

export default UserRow;
