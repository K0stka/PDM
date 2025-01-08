import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { NextPage } from "next";

const InvalidAccountPage: NextPage = async () => {
	return (
		<div className="size-full flex items-center justify-center">
			<Card className="mx-4">
				<CardHeader>
					<CardTitle>Chyba</CardTitle>
				</CardHeader>
				<CardContent>Konfigurace Vašeho účtu je neplatná. Prosím kontaktujte organizátory akce.</CardContent>
			</Card>
		</div>
	);
};

export default InvalidAccountPage;
