"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { SetState } from "@/lib/utilityTypes";
import { addPlace } from "@/actions/place";
import { addPlaceSchema } from "@/validation/place";
import { useForm } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddPlaceProps {
	open: boolean;
	onOpenChange: SetState<boolean>;
}

const AddPlace = ({ open, onOpenChange }: AddPlaceProps) => {
	const { action, pending } = useServerAction({
		action: addPlace,
		successToast: "Místo bylo přidáno úspěšně",
		errorToastTitle: "Místo se nepodařilo přidat",
		loadingToast: "Přidávám místo",
		onSuccess: () => onOpenChange(false),
	});

	const form = useForm<addPlaceSchema>({
		resolver: zodResolver(addPlaceSchema),
		defaultValues: { name: "" },
	});

	const onSubmit = async (data: addPlaceSchema) => {
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

export default AddPlace;
