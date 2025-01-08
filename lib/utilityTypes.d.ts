import { toast } from "sonner";

export type NextLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => JSX.Element | Promise<JSX.Element>;

export type Only<T, U> = {
	[P in keyof T]: T[P];
} & {
	[P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type FunctionDetails<F> = F extends (...args: infer Args) => infer Result ? { args: Args; result: Result } : never;

export type AsyncFunctionDetails<F> = F extends (...args: infer Args) => Promise<infer Result> ? { args: Args; result: Result } : never;

export type ToastProps = FunctionDetails<typeof toast.success>["args"];
