import { AppIcon } from "@/configuration/icon";
import { Button } from "@/components/ui/button";
import Microsoft from "@/components/icons/Microsoft";
import { NextPage } from "next";
import { configuration } from "@/configuration/configuration";
import { login } from "@/actions/auth";

const LoginPage: NextPage = () => {
	return (
		<>
			<AppIcon className="size-40 p-3 rounded-3xl" />
			<h1 className="flex items-center gap-5 flex-col">
				<span className="nunito font-bold text-3xl">{configuration.appName}</span>
			</h1>
			<Button
				onClick={login}
				className="nunito text-1xl mt-8"
				variant="outline"
				size="lg">
				<Microsoft className="h-10 w-10 shrink-0" />
				Přihlásit se
			</Button>
		</>
	);
};

export default LoginPage;
