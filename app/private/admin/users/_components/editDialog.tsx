"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    fetchWithServerAction,
    useServerAction,
} from "@/hooks/use-server-action";

import ClaimRow from "./claimRow";
import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { User } from "@/lib/types";
import { catchUserError } from "@/lib/utils";
import { configuration } from "@/configuration/configuration";
import { editUser } from "@/actions/user";
import { editUserSchema } from "@/validation/user";
import { getRoleIcon } from "@/configuration/roles";
import { getUserClaims } from "@/actions/claim";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
        onSuccess: () => onOpenChange(false),
    });

    const {
        data: claims,
        returningInitial: isClaimsLoading,
        refresh: loadUserClaims,
    } = fetchWithServerAction({
        action: async (id: number) => {
            const response = await getUserClaims(id);

            const [data, error] = catchUserError(response);

            if (error) {
                toast.error("Nepodařilo se načíst volby uživatele");

                return [];
            }

            return data;
        },
        initial: [],
        initialArgs: false,
    });

    const form = useForm<editUserSchema>({
        resolver: zodResolver(editUserSchema),
    });

    useEffect(() => {
        form.reset({
            id: user.id,
            name: user.name,
            email: user.email,
            class: user.class ?? "none",
            isAttending: user.isAttending,
            isTeacher: user.isTeacher,
            isPresenting: user.isPresenting,
            isAdmin: user.isAdmin,
        });

        loadUserClaims(user.id);
    }, [user]);

    const onSubmit = async (data: editUserSchema) => {
        await action(data);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
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

                onOpenChange(isOpen);
            }}
        >
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
                                            values={[
                                                {
                                                    value: "none",
                                                    label: "Žádná třída",
                                                },
                                                ...configuration.validClasses.map(
                                                    (c) => ({
                                                        value: c,
                                                    }),
                                                ),
                                            ]}
                                            placeholder="Vyberte třídu..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="isAttending"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 grid grid-cols-subgrid items-center justify-start space-y-0">
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
                                    <FormItem className="col-span-2 grid grid-cols-subgrid items-center justify-start space-y-0">
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
                                    <FormItem className="col-span-2 grid grid-cols-subgrid items-center justify-start space-y-0">
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
                                    <FormItem className="col-span-2 grid grid-cols-subgrid items-center justify-start space-y-0">
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
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Uložit
                    </ServerActionButton>
                </DialogFooter>
                {user.isAttending &&
                    (!isClaimsLoading ? (
                        <div className="flex flex-col gap-2">
                            <div className="text-sm">Volby dílen</div>
                            {claims.map((claim) => (
                                <ClaimRow
                                    key={claim.id}
                                    claim={claim}
                                    onRemove={() => loadUserClaims(user.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <Skeleton className="h-20" />
                    ))}
            </DialogContent>
        </Dialog>
    );
};

export default EditDialog;
