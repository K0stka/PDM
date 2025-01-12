import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Microsoft from "@/components/icons/Microsoft";
import { NextPage } from "next";
import { login } from "@/actions/auth";

const LoginFailedPage: NextPage = async () => {
	return (
		<Card>
			<CardHeader>
				<h1 className="nunito text-3xl font-bold">Nastala změna ve vašem účtu</h1>
			</CardHeader>
			<CardContent>
				<h4 className="text-center font-bold">
					Byli jste odhlášeni z důvodu změny ve vašem účtu.
					<br />
					Prosím, přihlaste se znovu.
				</h4>
			</CardContent>
			<CardFooter className="justify-center">
				<Button
					onClick={login}
					className="nunito text-1xl"
					variant="outline"
					size="lg">
					<Microsoft className="h-10 w-10 shrink-0" />
					Přihlásit se znovu
				</Button>
			</CardFooter>
		</Card>
	);
};

export default LoginFailedPage;
