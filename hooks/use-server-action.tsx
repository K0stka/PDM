"use client";

import { AsyncFunctionDetails, ToastProps, UserErrorType } from "@/lib/utilityTypes";
import { useEffect, useState } from "react";

import { toast } from "sonner";

type UseServerActionHook = <F>(options: {
	action: F extends (...args: infer A) => Promise<any> ? F : never;
	loadingToast: string | Omit<ToastProps, "description"> | false;
	successToast: string | Omit<ToastProps, "description"> | false;
	errorToastTitle: string | Omit<ToastProps, "description"> | false;
	serverErrorToastTitle?: string | Omit<ToastProps, "description"> | false;
	onSuccess?: (result: AsyncFunctionDetails<typeof options.action>["result"]) => void;
	onError?: (error: UserErrorType) => void;
	onServerError?: (error: Error) => void;
	onFinished?: () => void;
}) => {
	action: typeof options.action;
	pending: boolean;
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
				.then(async (result) => {
					if (loadingToastId) toast.dismiss(loadingToastId);

					if (result?.type === "error") {
						if (errorToastTitle) toast.error(...transformToastParams(errorToastTitle, result.message));

						if (onError) await onError(result);

						reject(result);
					} else {
						if (successToast) toast.success(...transformToastParams(successToast));

						if (onSuccess) await onSuccess(result);

						resolve(result);
					}
				})
				.catch(async (error) => {
					if (loadingToastId) toast.dismiss(loadingToastId);

					if (serverErrorToastTitle !== false) toast.warning(...transformToastParams(serverErrorToastTitle ?? "Nastala neočekávaná chyba", error.message));

					if (onServerError) await onServerError(error);

					reject(error);
				})
				.finally(async () => {
					setPending(false);

					if (onFinished) await onFinished();
				});
		});
	};

	return {
		action: wrappedAction as typeof action,
		pending,
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
