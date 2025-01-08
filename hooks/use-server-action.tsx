"use client";

import { AsyncFunctionDetails, ToastProps } from "@/lib/utilityTypes";
import { useEffect, useState } from "react";

import { UserError } from "@/lib/utils";
import { toast } from "sonner";

type UseServerActionHook = <F>(options: {
	action: F extends (...args: infer A) => Promise<any> ? F : never;
	loadingToast: string | Omit<ToastProps, "description"> | false;
	successToast: string | Omit<ToastProps, "description"> | false;
	errorToastTitle: string | Omit<ToastProps, "description"> | false;
	serverErrorToastTitle: string | Omit<ToastProps, "description"> | false;
	onSuccess?: (result: AsyncFunctionDetails<typeof options.action>["result"]) => void;
	onError?: (error: UserError) => void;
	onServerError?: (error: Error) => void;
	onFinished?: () => void;
}) => {
	action: typeof options.action;
	pending: boolean;
	buttonDisabled: { disabled: boolean };
};

const transformToastParams = (params: string | Omit<ToastProps, "description">, description?: string): ToastProps => (typeof params === "string" ? [params, { description }] : description ? [params[0], { ...params[1], description }] : params);

export const useServerAction: UseServerActionHook = ({ action, loadingToast, successToast, errorToastTitle, serverErrorToastTitle, onSuccess, onError, onServerError, onFinished }) => {
	const [pending, setPending] = useState(false);

	const wrappedAction = async (...params: AsyncFunctionDetails<typeof action>["args"]) => {
		setPending(true);

		const loadingToastId = loadingToast && toast.loading(...transformToastParams(loadingToast));

		return new Promise<AsyncFunctionDetails<typeof action>["result"]>((resolve, reject) => {
			action
				.call(null, ...params)
				.then((result) => {
					if (loadingToastId) toast.dismiss(loadingToastId);

					if (successToast) toast.success(...transformToastParams(successToast));

					if (onSuccess) onSuccess(result);

					resolve(result);
				})
				.catch((error) => {
					if (loadingToastId) toast.dismiss(loadingToastId);

					if (error instanceof UserError) {
						if (errorToastTitle) toast.error(...transformToastParams(errorToastTitle, error.message));

						if (onError) onError(error);
					} else {
						if (serverErrorToastTitle) toast.warning(...transformToastParams(serverErrorToastTitle, error.message));

						if (onServerError) onServerError(error);
					}

					reject(error);
				})
				.finally(() => {
					setPending(false);

					if (onFinished) onFinished();
				});
		});
	};

	return {
		action: wrappedAction as typeof action,
		pending,
		buttonDisabled: { disabled: pending },
	};
};

type FetchWithServerAction = <F extends () => Promise<any>>(options: {
	action: F;
	initial: AsyncFunctionDetails<F>["result"];
	refreshAfter?: number;
}) => {
	data: AsyncFunctionDetails<F>["result"];
	loading: boolean;
	updating: boolean;
	refresh: () => Promise<void>;
};

export const fetchWithServerAction: FetchWithServerAction = ({ action, initial, refreshAfter }) => {
	const [data, setData] = useState(initial);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(true);

	const fetchData = async () => {
		setUpdating(true);

		await action()
			.then(setData)
			.catch(console.error)
			.finally(() => setUpdating(false));
	};

	const refresh = async () => {
		if (refreshAfter) throw new Error("Cannot refresh when staleAfterSeconds is set");

		setLoading(true);
		setData(initial);
		await fetchData();
		setLoading(false);
	};

	useEffect(() => {
		fetchData().finally(() => setLoading(false));

		const interval = refreshAfter ? setInterval(fetchData, refreshAfter * 1000) : undefined;

		return () => {
			if (interval) clearInterval(interval);
		};
	}, []);

	return {
		data,
		loading,
		updating,
		refresh,
	};
};
