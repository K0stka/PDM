import { clsx, type ClassValue } from "clsx";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { twMerge } from "tailwind-merge";
import { UserErrorType } from "./utilityTypes";
import { ZodError } from "zod";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const rethrowRedirect = (error: unknown) => {
    if (isRedirectError(error)) throw error;
};

export const inlineCatch = <T>(fn: () => T): [T, null] | [null, Error] => {
    try {
        return [fn() as T, null];
    } catch (error) {
        return [null, error as Error];
    }
};

export const asyncInlineCatch = async <T>(
    fn: () => Promise<T>,
): Promise<[T, null] | [null, Error]> => {
    try {
        return [(await fn()) as T, null];
    } catch (error) {
        return [null, error as Error];
    }
};

export const UserError = (
    message: string | Error | ZodError,
): UserErrorType => ({
    type: "error",
    message:
        message instanceof ZodError
            ? message.errors[0].message
            : message instanceof Error
              ? message.message
              : message,
});

export const UnauthorizedError = (): UserErrorType =>
    UserError("K provedení této akce nemáte dostatečná oprávnění");

export const catchUserError = <T>(
    data: UserErrorType | T,
): [T, null] | [null, UserErrorType] =>
    (data as UserErrorType | { type?: unknown })?.type === "error"
        ? [null, data as UserErrorType]
        : [data as T, null];

export const pluralHelper = (
    count: number,
    singular: string,
    TwoToFile: string,
    Many: string | null = null,
) =>
    count === 1
        ? singular
        : (count >= 2 && count <= 4) || !Many
          ? TwoToFile
          : Many;

export const printDate = (date: Date) => format(date, "d. M. yyyy");

export const printTime = (date: Date) => format(date, "H:mm");

export const printDateTime = (date: Date) => format(date, "d. M. yyyy H:mm");

export const createMapById = <T, K extends keyof T, L extends keyof T>(
    data: T[],
    idKey: K,
    dataKey: L,
): Map<T[K], T[L]> => {
    const result: Map<T[K], T[L]> = new Map();

    data.forEach((d) => result.set(d[idKey], d[dataKey]));

    return result;
};

export const parseIntOrNull = (value: string) => {
    const parsed = parseInt(value);

    return isNaN(parsed) ? null : parsed;
};
