import {
    Edit,
    Filter,
    FilterX,
    RefreshCcw,
    SquareCheck,
    SquareDashed,
    XSquare,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getRoleIcon, roleNames } from "@/configuration/roles";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./header";
import { User } from "@/lib/types";
import { getRoleName } from "@/lib/roles";

interface ColumnsProps {
    filter: {
        attending: boolean | null;
        teacher: boolean | null;
        presenting: boolean | null;
        admin: boolean | null;
        query: string;
    };
    roleFilterActive: boolean;
    cycleRoleFilter: (role: keyof typeof roleNames) => void;
    cancelRoleFilter: () => void;
    onEditUser: (user: User) => void;
}

export const getColumns: (options: ColumnsProps) => ColumnDef<User>[] = ({
    filter,
    roleFilterActive,
    cycleRoleFilter,
    cancelRoleFilter,
    onEditUser,
}) => [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader title="Jméno" column={column} first />
        ),
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar user={row.original} />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader title="Email" column={column} />
        ),
    },
    {
        accessorKey: "class",
        header: ({ column }) => (
            <DataTableColumnHeader title="Třída" column={column} />
        ),
    },
    {
        id: "roles",
        header: () => (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        Role
                        {roleFilterActive ? <FilterX /> : <Filter />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="grid w-auto grid-cols-[auto,auto] gap-x-4 gap-y-2 p-2"
                >
                    {(
                        [
                            "attending",
                            "teacher",
                            "presenting",
                            "admin",
                        ] as (keyof typeof roleNames)[]
                    ).map((role) => (
                        <Button
                            variant="ghost"
                            key={role}
                            onClick={() => cycleRoleFilter(role)}
                            className="col-span-2 grid h-auto cursor-pointer grid-cols-subgrid p-2 text-sm"
                        >
                            <span className="flex items-center gap-2">
                                {getRoleIcon(role)} {getRoleName(role)}
                            </span>
                            {filter[role] === null ? (
                                <SquareDashed />
                            ) : filter[role] ? (
                                <SquareCheck />
                            ) : (
                                <XSquare />
                            )}
                        </Button>
                    ))}
                    {roleFilterActive && (
                        <Button
                            variant="ghost"
                            className="col-span-2 grid h-auto cursor-pointer grid-cols-subgrid p-2 text-sm text-muted-foreground"
                            onClick={cancelRoleFilter}
                        >
                            Resetovat
                            <RefreshCcw />
                        </Button>
                    )}
                </PopoverContent>
            </Popover>
        ),
        cell: ({ row }) => {
            const roles: (keyof typeof roleNames)[] = [];
            if (row.original.isAttending) roles.push("attending");
            if (row.original.isTeacher) roles.push("teacher");
            if (row.original.isPresenting) roles.push("presenting");
            if (row.original.isAdmin) roles.push("admin");

            return roles.map((role) => getRoleIcon(role));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEditUser(row.original)}
                >
                    <Edit />
                </Button>
            );
        },
    },
];
