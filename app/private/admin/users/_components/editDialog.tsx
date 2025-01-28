"use client";

import { Block, User } from "@/lib/types";
import {
    BlocksState,
    adminSaveClaims,
    getUserBlockState,
} from "@/actions/claim";
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
import { useEffect, useState } from "react";

import { BlockClaims } from "@/app/private/attending/claims/_components/clientPage";
import BlockElement from "@/app/private/attending/claims/_components/block";
import { ComboBox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { catchUserError } from "@/lib/utils";
import { configuration } from "@/configuration/configuration";
import { editUser } from "@/actions/user";
import { editUserSchema } from "@/validation/user";
import { getRoleIcon } from "@/configuration/roles";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditDialogProps {
    user: User;
    setEditDialogUser: SetState<User | null>;
    open: boolean;
    onOpenChange: SetState<boolean>;
}

const EditDialog = ({ user, open, onOpenChange }: EditDialogProps) => {
    const [claims, setClaims] = useState<BlockClaims>({});

    const { action: editAction, pending: editPending } = useServerAction({
        action: editUser,
        successToast: "Uživatel byl upraven úspěšně",
        errorToastTitle: "Uživatele se nepodařilo upravit",
        loadingToast: "Upravuji uživatele",
        onSuccess: () => onOpenChange(false),
    });

    const { action: editClaims, pending: editClaimsPending } = useServerAction({
        action: adminSaveClaims,
        successToast: "Volby uživatele byly uloženy úspěšně",
        errorToastTitle: "Volby uživatele se nepodařilo uložit",
        loadingToast: "Ukládám volby uživatele",
    });

    const {
        data: blockState,
        returningInitial: isBlockStateLoading,
        refresh: loadUserBlockState,
    } = fetchWithServerAction({
        action: async (id: number) => {
            const response = await getUserBlockState(id);

            const [data, error] = catchUserError(response);

            if (error) {
                toast.error("Nepodařilo se načíst volby uživatele");

                return [];
            }

            resetClaims(data);

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

        loadUserBlockState(user.id);
    }, [user]);

    const onSubmit = async (data: editUserSchema) => {
        await editAction(data);
    };

    const updateClaims = (
        blockId: Block["id"],
        newClaims: BlockClaims[number],
    ) => {
        if (
            blockState.some((b) => {
                if (b.id === blockId) return false;

                if (
                    newClaims.primary !== null &&
                    claims[b.id].primary === newClaims.primary
                ) {
                    toast.warning("Nelze vybrat 2 stejné primární přednášky");

                    return true;
                }

                if (
                    newClaims.secondary !== null &&
                    newClaims.secondary === claims[b.id].primary
                ) {
                    toast.warning(
                        "Nelze zvolit stejnou sekundární přednášku jako primární v jiném bloku",
                    );

                    return true;
                }

                if (
                    newClaims.secondary !== null &&
                    newClaims.secondary === claims[b.id].secondary
                ) {
                    toast.warning("Nelze vybrat 2 stejné sekundární přednášky");

                    return true;
                }

                return false;
            })
        )
            return;

        setClaims((oldClaims) => ({
            ...oldClaims,
            [blockId]: newClaims,
        }));
    };

    const resetClaims = (data: BlocksState) => {
        const blockClaims: BlockClaims = {};

        data.forEach((d) => {
            blockClaims[d.id] = {
                primary: d.primaryClaim,
                secondary: d.secondaryClaim,
            };
        });

        setClaims(blockClaims);
    };

    const saveClaims = () => {
        editClaims({
            claims: blockState.map((b) => ({
                block: b.id,
                primaryArchetype: claims[b.id].primary ?? null,
                secondaryArchetype: claims[b.id].secondary ?? null,
            })),
            user: user.id,
        });
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

                resetClaims(blockState);

                onOpenChange(isOpen);
            }}
        >
            <DialogContent className="grid max-w-[80vw] grid-cols-1 items-stretch gap-8 lg:grid-cols-[auto,auto]">
                <div className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Upravit uživatele</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            className="mb-auto"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
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
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
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
                            pending={editPending}
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            Uložit
                        </ServerActionButton>
                    </DialogFooter>
                </div>
                {user.isAttending && (
                    <div className="flex flex-col gap-4">
                        <DialogHeader>
                            <DialogTitle>Volby dílen</DialogTitle>
                            <DialogDescription />
                        </DialogHeader>
                        {!isBlockStateLoading ? (
                            <>
                                {blockState.map((block) => (
                                    <BlockElement
                                        key={block.id}
                                        block={block}
                                        claims={claims[block.id]}
                                        onClaimsChange={(newClaims) =>
                                            updateClaims(block.id, newClaims)
                                        }
                                        admin
                                    />
                                ))}
                            </>
                        ) : (
                            <Skeleton className="h-full" />
                        )}
                        <DialogFooter>
                            <ServerActionButton
                                pending={editClaimsPending}
                                onClick={saveClaims}
                            >
                                Uložit
                            </ServerActionButton>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditDialog;
