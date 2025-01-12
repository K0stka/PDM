"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ComboBox } from "@/components/ui/combobox";
import { Separator } from "@/components/ui/separator";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { ZodError } from "zod";
import { accountSetup } from "@/actions/accountSetup";
import { accountSetupSchema } from "@/validation/accountSetup";
import { configuration } from "@/configuration/configuration";
import { inlineCatch } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";
import { useState } from "react";

const InvalidAccountClientPage = () => {
	const [isTeacher, setIsTeacher] = useState(false);
	const [className, setClassName] = useState<string>();

	const { action, pending } = useServerAction({
		action: accountSetup,
		loadingToast: "Ukládání...",
		successToast: "Informace byly uloženy",
		errorToastTitle: "Nastala chyba při ukládání informací",
		onSuccess: () => window.location.reload(),
	});

	const onSubmit = async () => {
		const [validated, error] = inlineCatch(() => accountSetupSchema.parse({ isTeacher, class: className }));

		if (error)
			return toast.error("Některé informace jsou neplatné", {
				description: (error as ZodError).errors[0].message,
			});

		if (!validated.isTeacher && !validated.class) return toast.error("Vyplňte třídu");

		await action({ isTeacher: validated.isTeacher, class: validated.isTeacher ? undefined : validated.class });
	};

	return (
		<Card className="mx-4">
			<CardHeader>
				<CardTitle>Než budete pokračovat...</CardTitle>
				<CardDescription>Potřebujeme o Vás vědět trochu více</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex gap-4 items-center">
					Jsem
					<Select
						value={isTeacher ? "teacher" : "student"}
						onValueChange={(v) => setIsTeacher(v === "teacher")}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="student">Žák</SelectItem>
							<SelectItem value="teacher">Učitel</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{!isTeacher && (
					<>
						<Separator />
						<div className="flex gap-4 items-center">
							Chodím do
							<ComboBox
								value={className}
								placeholder="Vyberte třídu"
								values={configuration.validClasses.map((c) => ({ value: c }))}
								onChange={setClassName}
							/>
						</div>
					</>
				)}
				<span className="text-muted-foreground text-sm">
					Upozorňujeme, že zadané informace se nedají změnit.
					<br />V případě chyby je potřeba kontaktovat organizátora akce.
				</span>
			</CardContent>
			<CardFooter>
				<ServerActionButton
					pending={pending}
					onClick={onSubmit}>
					Potvrdit
				</ServerActionButton>
			</CardFooter>
		</Card>
	);
};

export default InvalidAccountClientPage;
