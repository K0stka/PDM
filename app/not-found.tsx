import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NextPage } from "next";

const NotFound: NextPage = async () => {
	return (
		<div className="w-dhv h-dvh flex items-center justify-center">
			<Card className="mx-4">
				<CardHeader>
					<CardTitle>Stránka nenalezena</CardTitle>
					<CardDescription>Pod touto URL nebyla nalezena žádná stránka. Zkontrolujte prosím zadanou adresu.</CardDescription>
				</CardHeader>
				<CardFooter>
					<Link href="/">
						<Button variant="outline">Zpět na úvodní stránku</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
};

export default NotFound;
