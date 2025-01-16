"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./header";
import No from "@/components/icons/No";
import { User } from "@/lib/types";
import Yes from "@/components/icons/Yes";

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader
				title="Jméno"
				column={column}
			/>
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
			<DataTableColumnHeader
				title="Email"
				column={column}
			/>
		),
	},
	{
		accessorKey: "isAttending",
		header: ({ column }) => (
			<DataTableColumnHeader
				title="Účastník"
				column={column}
			/>
		),
		cell: ({ row }) => <div className="text-center">{row.original.isAttending ? <Yes /> : <No />}</div>,
	},
	{
		accessorKey: "isTeacher",
		header: ({ column }) => (
			<DataTableColumnHeader
				title="Učitel"
				column={column}
			/>
		),
		cell: ({ row }) => <div className="text-center">{row.original.isTeacher ? <Yes /> : <No />}</div>,
	},
	{
		accessorKey: "isPresenting",
		header: ({ column }) => (
			<DataTableColumnHeader
				title="Prezentující"
				column={column}
			/>
		),
		cell: ({ row }) => <div className="text-center">{row.original.isPresenting ? <Yes /> : <No />}</div>,
	},
	{
		accessorKey: "isAdmin",
		header: ({ column }) => (
			<DataTableColumnHeader
				title="Administrátor"
				column={column}
			/>
		),
		cell: ({ row }) => <div className="text-center">{row.original.isAdmin ? <Yes /> : <No />}</div>,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<Button
					size="icon"
					variant="outline">
					<Edit />
				</Button>
			);
		},
	},
];
