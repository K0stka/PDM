"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { ComboBox } from "@/components/ui/combobox";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { Switch } from "@/components/ui/switch";
import { User } from "@/lib/types";
import { configuration } from "@/configuration/configuration";
import { editUser } from "@/actions/user";
import { editUserSchema } from "@/validation/user";
import { getRoleIcon } from "@/configuration/roles";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditDialogProps {
	user: User;
	setEditDialogUser: SetState<User | null>;
	open: boolean;
	onOpenChange: SetState<boolean>;
}

const EditDialog = ({ user, open, onOpenChange }: EditDialogProps) => {
	const { action, pending } = useServerAction({
		action: editUser,
		successToast: "Uživatel byl upraven úspěšně",
		errorToastTitle: "Uživatele se nepodařilo upravit",
		loadingToast: "Upravuji uživatele",
	});

	const form = useForm<editUserSchema>({
		resolver: zodResolver(editUserSchema),
	});

	useEffect(() => {
		form.reset({
			id: user.id,
			name: user.name,
			email: user.email,
			class: user.class ?? undefined,
			isAttending: user.isAttending,
			isTeacher: user.isTeacher,
			isPresenting: user.isPresenting,
			isAdmin: user.isAdmin,
		});
	}, [user]);

	const onSubmit = async (data: editUserSchema) => {
		await action(data);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upravit uživatele</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="my-4">
									<FormLabel>Jméno</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="my-4">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="class"
							render={({ field }) => (
								<FormItem className="my-4">
									<FormLabel>Třída</FormLabel>
									<FormControl>
										<ComboBox
											className="w-full"
											values={configuration.validClasses.map((c) => ({
												value: c,
											}))}
											placeholder="Vyberte třídu..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4 mt-4">
							<FormField
								control={form.control}
								name="isAttending"
								render={({ field }) => (
									<FormItem className="grid space-y-0 grid-cols-subgrid justify-start items-center col-span-2">
										<FormLabel className="flex items-center gap-2">
											{getRoleIcon("attending")}
											Účastní se
										</FormLabel>
										<FormControl>
											<Switch
												className="mt-0"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isTeacher"
								render={({ field }) => (
									<FormItem className="grid space-y-0 grid-cols-subgrid justify-start items-center col-span-2">
										<FormLabel className="flex items-center gap-2">
											{getRoleIcon("teacher")}
											Učitel
										</FormLabel>
										<FormControl>
											<Switch
												className="mt-0"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isPresenting"
								render={({ field }) => (
									<FormItem className="grid space-y-0 grid-cols-subgrid justify-start items-center col-span-2">
										<FormLabel className="flex items-center gap-2">
											{getRoleIcon("presenting")}
											Prezentující
										</FormLabel>
										<FormControl>
											<Switch
												className="mt-0"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isAdmin"
								render={({ field }) => (
									<FormItem className="grid space-y-0 grid-cols-subgrid justify-start items-center col-span-2">
										<FormLabel className="flex items-center gap-2">
											{getRoleIcon("admin")}
											Administrátor
										</FormLabel>
										<FormControl>
											<Switch
												className="mt-0"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<ServerActionButton
						pending={pending}
						onClick={form.handleSubmit(onSubmit)}>
						Uložit
					</ServerActionButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditDialog;
