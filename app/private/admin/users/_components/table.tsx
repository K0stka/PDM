"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    FilterFn,
    Row,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditDialog from "./editDialog";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types";
import { getColumns } from "./columns";
import { pluralHelper } from "@/lib/utils";
import { rankItem } from "@tanstack/match-sorter-utils";
import { roleNames } from "@/configuration/roles";
import { useState } from "react";

interface DataTableProps<TData> {
    data: TData[];
}

export function UsersTable({ data }: DataTableProps<User>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [filter, setFilter] = useState<{
        attending: boolean | null;
        teacher: boolean | null;
        presenting: boolean | null;
        admin: boolean | null;
        query: string;
    }>({
        attending: null,
        teacher: null,
        presenting: null,
        admin: null,
        query: "",
    });

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editDialogUser, setEditDialogUser] = useState<User | null>(null);

    const cycleRoleFilter = (role: keyof typeof roleNames) => {
        const value = filter[role];
        table.setGlobalFilter({
            ...filter,
            [role]: value === null ? true : value ? false : null,
        });
    };

    const cancelRoleFilter = () =>
        table.setGlobalFilter({
            attending: null,
            teacher: null,
            presenting: null,
            admin: null,
            query: filter.query,
        });

    const setQuery = (query: string) =>
        table.setGlobalFilter({ ...filter, query });

    const roleFilterActive =
        filter.attending !== null ||
        filter.teacher !== null ||
        filter.presenting !== null ||
        filter.admin !== null;

    const filterFn: FilterFn<User> = (
        row: Row<User>,
        _columnId,
        _value,
        addMeta,
    ) => {
        if (
            filter.attending !== null &&
            row.original.isAttending !== filter.attending
        )
            return false;
        if (
            filter.teacher !== null &&
            row.original.isTeacher !== filter.teacher
        )
            return false;
        if (
            filter.presenting !== null &&
            row.original.isPresenting !== filter.presenting
        )
            return false;
        if (filter.admin !== null && row.original.isAdmin !== filter.admin)
            return false;

        if (filter.query) {
            const itemRank = rankItem(
                row.original.name +
                    " " +
                    row.original.email +
                    " " +
                    row.original.class,
                filter.query,
            );

            addMeta({ itemRank });

            return itemRank.passed;
        }

        return true;
    };

    const table = useReactTable({
        data,
        columns: getColumns({
            filter,
            roleFilterActive,
            cancelRoleFilter,
            cycleRoleFilter,
            onEditUser: (user) => {
                setEditDialogUser(user);
                setEditDialogOpen(true);
            },
        }),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setFilter,
        state: {
            sorting,
            globalFilter: filter,
        },
        globalFilterFn: filterFn,
    });

    return (
        <>
            {editDialogUser && (
                <EditDialog
                    user={editDialogUser}
                    setEditDialogUser={setEditDialogUser}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                />
            )}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Vyhledávejte..."
                    value={filter.query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Card className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="px-1"
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            className="text-nowrap p-1"
                                            key={cell.id}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-10 w-full text-center"
                                >
                                    Nebyl nalezen žádný uživatel odpovídající
                                    kritérium.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
            <div className="flex flex-wrap items-center justify-end gap-2 space-x-2 py-4">
                <span className="mr-3 text-sm text-muted-foreground">
                    {!roleFilterActive && !filter.query ? (
                        <>
                            Celkem {data.length}{" "}
                            {pluralHelper(
                                data.length,
                                "uživatel",
                                "uživatelé",
                                "uživatelů",
                            )}
                        </>
                    ) : (
                        <>
                            Vyhledávání odpovídá {table.getRowCount()} z{" "}
                            {data.length}{" "}
                            {pluralHelper(
                                data.length,
                                "uživatel",
                                "uživatelé",
                                "uživatelů",
                            )}
                        </>
                    )}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft />
                    Předchozí
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Další
                    <ChevronRight />
                </Button>
            </div>
        </>
    );
}
