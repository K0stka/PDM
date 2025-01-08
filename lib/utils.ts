import { clsx, type ClassValue } from "clsx";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const rethrowRedirect = (error: any) => {
	if (isRedirectError(error)) throw error;
};

export class UserError extends Error {}
