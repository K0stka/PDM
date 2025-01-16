import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareCheck, SquareX } from "lucide-react";

import ClassSelector from "./_components/classSelector";
import { NextPage } from "next";
import No from "@/components/icons/No";
import PageTemplate from "@/components/utility/PageTemplate";
import Yes from "@/components/icons/Yes";
import { session } from "@/auth/session";

const SettingsPage: NextPage = async () => {
	const user = await session();

	return (
		<PageTemplate title="Nastavení">
			<div className="flex flex-col gap-5">
				<Card>
					<CardHeader>
						<CardTitle>Informace o účtu</CardTitle>
						<CardDescription>V případě, že jsou uvedené informace nesprávné, kontaktujte prosím organizátora akce.</CardDescription>
					</CardHeader>
					<CardContent className="inline-grid grid-cols-2 gap-2 items-center">
						<b>Jméno a příjmení:</b> <span>{user.name}</span>
						<b>Mail:</b> <span>{user.email}</span>
						<b>Účastník akce:</b>
						{user.isAttending ? <Yes withText /> : <No withText />}
						<b>Prezentující:</b>
						{user.isPresenting ? <Yes withText /> : <No withText />}
					</CardContent>
				</Card>
				{user.isAttending && <ClassSelector />}
			</div>
		</PageTemplate>
	);
};

export default SettingsPage;
