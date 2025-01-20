"use client";

import {
    AsyncFunctionDetails,
    ToastProps,
    UserErrorType,
} from "@/lib/utilityTypes";
import { useEffect, useState } from "react";

import { toast } from "sonner";

type UseServerActionHook = <F extends Function>(options: {
    action: F;
    loadingToast: string | Omit<ToastProps, "description"> | false;
    successToast: string | Omit<ToastProps, "description"> | false;
    errorToastTitle: string | Omit<ToastProps, "description"> | false;
    serverErrorToastTitle?: string | Omit<ToastProps, "description"> | false;
    onSuccess?: (
        result: AsyncFunctionDetails<typeof options.action>["result"],
    ) => void;
    onError?: (error: UserErrorType) => void;
    onServerError?: (error: Error) => void;
    onFinished?: () => void;
}) => {
    action: typeof options.action;
    pending: boolean;
};

const transformToastParams = (
    params: string | Omit<ToastProps, "description">,
    description?: string,
): ToastProps =>
    typeof params === "string"
        ? [params, { description }]
        : description
          ? [params[0], { ...params[1], description }]
          : params;

export const useServerAction: UseServerActionHook = ({
    action,
    loadingToast,
    successToast,
    errorToastTitle,
    serverErrorToastTitle,
    onSuccess,
    onError,
    onServerError,
    onFinished,
}) => {
    const [pending, setPending] = useState(false);

    const wrappedAction = async (
        ...params: AsyncFunctionDetails<typeof action>["args"]
    ) => {
        setPending(true);

        const loadingToastId =
            loadingToast &&
            toast.loading(...transformToastParams(loadingToast));

        return new Promise<AsyncFunctionDetails<typeof action>["result"]>(
            (resolve, reject) => {
                action
                    .call(null, ...params)
                    .then(async (result: any) => {
                        if (loadingToastId) toast.dismiss(loadingToastId);

                        if (result?.type === "error") {
                            if (errorToastTitle)
                                toast.error(
                                    ...transformToastParams(
                                        errorToastTitle,
                                        result.message,
                                    ),
                                );

                            if (onError) await onError(result);

                            reject(result);
                        } else {
                            if (successToast)
                                toast.success(
                                    ...transformToastParams(successToast),
                                );

                            if (onSuccess) await onSuccess(result);

                            resolve(result);
                        }
                    })
                    .catch(async (error: Error) => {
                        if (loadingToastId) toast.dismiss(loadingToastId);

                        if (serverErrorToastTitle !== false)
                            toast.warning(
                                ...transformToastParams(
                                    serverErrorToastTitle ??
                                        "Nastala neočekávaná chyba",
                                    error.message,
                                ),
                            );

                        if (onServerError) await onServerError(error);

                        reject(error);
                    })
                    .finally(async () => {
                        setPending(false);

                        if (onFinished) await onFinished();
                    });
            },
        );
    };

    return {
        action: wrappedAction as unknown as typeof action,
        pending,
    };
};

type FetchWithServerAction = <F extends Function>(options: {
    action: F;
    initial: AsyncFunctionDetails<F>["result"];
    initialArgs?: AsyncFunctionDetails<F>["args"];
    refreshAfter?: number;
}) => {
    data: AsyncFunctionDetails<F>["result"];
    returningInitial: boolean;
    updating: boolean;
    refresh: (...args: AsyncFunctionDetails<F>["args"]) => Promise<void>;
};

export const fetchWithServerAction: FetchWithServerAction = ({
    action,
    initial,
    initialArgs,
    refreshAfter,
}) => {
    const [data, setData] = useState(initial);
    const [returningInitial, setReturningInitial] = useState(true);
    const [updating, setUpdating] = useState(true);

    const fetchData = async (args: unknown[] = []) => {
        setUpdating(true);

        await action(...args)
            .then((result: any) => {
                if (result?.type === "error") {
                    toast.error("Nastala chyba", {
                        description: result.message,
                    });

                    return true;
                }

                setData(result);
            })
            .catch(console.error)
            .finally(() => setUpdating(false));
    };

    const refresh = async (...args: unknown[]) => {
        if (refreshAfter)
            throw new Error("Cannot refresh when staleAfterSeconds is set");

        setReturningInitial(true);
        setData(initial);
        await fetchData(args);
        setReturningInitial(false);
    };

    useEffect(() => {
        fetchData(initialArgs ?? []).finally(() => setReturningInitial(false));

        const interval = refreshAfter
            ? setInterval(fetchData, refreshAfter * 1000)
            : undefined;

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    return {
        data,
        returningInitial,
        updating,
        refresh,
    };
};
