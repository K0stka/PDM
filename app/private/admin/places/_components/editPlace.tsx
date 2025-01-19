"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Place } from "@/lib/types";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { editPlace } from "@/actions/place";
import { editPlaceSchema } from "@/validation/place";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditPlaceProps {
	open: boolean;
	onOpenChange: SetState<boolean>;
	place: Place;
}

const EditPlace = ({ open, onOpenChange, place }: EditPlaceProps) => {
	const { action, pending } = useServerAction({
		action: editPlace,
		successToast: "Změny byly uloženy úspěšně",
		errorToastTitle: "Změny se nepodařilo uložit",
		loadingToast: "Ukládám změny",
		onSuccess: () => onOpenChange(false),
	});

	const form = useForm<editPlaceSchema>({
		resolver: zodResolver(editPlaceSchema),
	});

	useEffect(() => {
		form.reset(place);
	}, [place]);

	const onSubmit = async (data: editPlaceSchema) => {
		await action(data);

		form.reset();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Přidat místo</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="my-4">
									<FormLabel>Název</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
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

export default EditPlace;
