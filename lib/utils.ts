import { clsx, type ClassValue } from "clsx";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { twMerge } from "tailwind-merge";
import { UserErrorType } from "./utilityTypes";
import { ZodError } from "zod";

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

export const UserError = (message: string | Error | ZodError): UserErrorType => ({
	type: "error",
	message: message instanceof ZodError ? message.errors[0].message : message instanceof Error ? message.message : message,
});

export const UnauthorizedError = (): UserErrorType => UserError("K provedení této akce nemáte dostatečná oprávnění");

export const getUserError = <T>(data: UserErrorType | T): [T, null] | [null, UserErrorType] => ((data as UserErrorType | any)?.type === "error" ? [null, data as UserErrorType] : [data as T, null]);

export const pluralHelper = (count: number, singular: string, TwoToFile: string, Many: string | null = null) => (count === 1 ? singular : (count >= 2 && count <= 4) || !Many ? TwoToFile : Many);
