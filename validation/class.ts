import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const ClassSelectorForm = z.object({
	className: z.enum(configuration.validClasses, {
		message: "Prosím zvolte třídu",
	}),
});

export type ClassSelectorForm = z.infer<typeof ClassSelectorForm>;
