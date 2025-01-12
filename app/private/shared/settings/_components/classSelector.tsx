"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { ClassSelectorForm } from "@/validation/class";
import { ComboBox } from "@/components/ui/combobox";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { UserContext } from "@/components/context/auth";
import { configuration } from "@/configuration/configuration";
import { setClass } from "@/actions/class";
import { use } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";

interface ClassSelectorProps {
	title?: string;
	revalidatePathOnSuccess?: true;
}

const ClassSelector = ({ title, revalidatePathOnSuccess }: ClassSelectorProps) => {
	const user = use(UserContext);

	const { action, pending } = useServerAction({
		action: setClass,
		loadingToast: false,
		successToast: "Třída úspěšně uložena",
		errorToastTitle: "Nastala chyba při ukládání třídy",
	});

	const form = useForm<ClassSelectorForm>({
		resolver: zodResolver(ClassSelectorForm),
		defaultValues: {
			className: user.class ?? "",
		},
	});

	const onSubmit = async (data: ClassSelectorForm) => await action(data, revalidatePathOnSuccess ? window?.location?.pathname : undefined);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card>
					<CardHeader>
						<CardTitle>{title ?? "Třída"}</CardTitle>
						<CardDescription>Prosím, vyplňte třídu, do které chodíte</CardDescription>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="className"
							render={({ field }) => (
								<FormItem>
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
					</CardContent>
					<CardFooter>
						<ServerActionButton
							pending={pending}
							onClick={form.handleSubmit(onSubmit)}>
							Uložit
						</ServerActionButton>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
};

export default ClassSelector;
