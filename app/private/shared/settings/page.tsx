"use client";

import { fetchWithServerAction, useServerAction } from "@/hooks/use-server-action";
import { test, test2 } from "@/actions/test";

import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const SettingsPage: NextPage = () => {
	console.log("SettingsPage");

	const { data, loading, updating, refresh } = fetchWithServerAction({
		action: () => {
			console.log("action");
			return test("asi nevim");
		},
		initial: { id: "" },
		// refreshAfter: 5,
	});

	const { action, pending, buttonDisabled } = useServerAction({
		action: test2,
		loadingToast: ["Hi", { description: "I'm loading" }],
		successToast: ["Success"],
		errorToastTitle: "Error",
		serverErrorToastTitle: "Server error",
		onError: console.error,
		onServerError: console.error,
		onFinished: () => console.log("Finished"),
		onSuccess: (result) => console.log("Success", result),
	});

	return (
		<PageTemplate title="Nastavení">
			<span suppressHydrationWarning>Time: {new Date().getTime()}</span>
			<br />
			Data: {JSON.stringify(data)}
			<br />
			Loading: {loading.toString()}
			<br />
			Updating: {updating.toString()}
			<br />
			<Button onClick={refresh}>Refresh</Button>
			<br />
			<br />
			<Button
				onClick={() => action("user-error")}
				{...buttonDisabled}>
				{pending ? "Pending" : "User error"}
			</Button>
			<br />
			<Button
				onClick={() => action("server-error")}
				{...buttonDisabled}>
				{pending ? "Pending" : "Server error"}
			</Button>
			<br />
			<Button
				onClick={() => action("success")}
				{...buttonDisabled}>
				{pending ? "Pending" : "Success"}
			</Button>
		</PageTemplate>
	);
};

export default SettingsPage;
