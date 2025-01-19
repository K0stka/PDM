"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Block } from "@/lib/types";
import { DateTimePicker } from "@/components/ui/dateTimePicker";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { editBlock } from "@/actions/block";
import { editBlockSchema } from "@/validation/block";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditBlockProps {
	open: boolean;
	onOpenChange: SetState<boolean>;
	block: Block;
}

const EditBlock = ({ open, onOpenChange, block }: EditBlockProps) => {
	const { action, pending } = useServerAction({
		action: editBlock,
		successToast: "Změny byly uloženy úspěšně",
		errorToastTitle: "Změny se nepodařilo uložit",
		loadingToast: "Ukládám změny",
		onSuccess: () => onOpenChange(false),
	});

	const form = useForm<editBlockSchema>({
		resolver: zodResolver(editBlockSchema),
	});

	useEffect(() => {
		form.reset(block);
	}, [block]);

	const onSubmit = async (data: editBlockSchema) => {
		await action(data);

		form.reset();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upravit blok</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="from"
							render={({ field }) => (
								<FormItem className="my-4 grid grid-cols-[auto,1fr] items-center gap-2 space-y-0">
									<FormLabel>Od</FormLabel>
									<FormControl>
										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											granularity="minute"
											yearRange={1}
											className="w-full"
										/>
									</FormControl>
									<FormMessage className="col-span-2" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="to"
							render={({ field }) => (
								<FormItem className="my-4 grid grid-cols-[auto,1fr] items-center gap-2 space-y-0">
									<FormLabel>Do</FormLabel>
									<FormControl>
										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											granularity="minute"
											yearRange={1}
											className="w-full"
										/>
									</FormControl>
									<FormMessage className="col-span-2" />
								</FormItem>
							)}
						/>
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

export default EditBlock;
