import { withId } from "./universal";
import { z } from "zod";

export const addArchetypeSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Název přednášky je povinný",
		})
		.max(255, {
			message: "Název přednášky může mít maximálně 255 znaků",
		}),
	description: z
		.string()
		.min(1, {
			message: "Popis přednášky je povinný",
		})
		.max(1023, {
			message: "Popis přednášky může mít maximálně 1023 znaků",
		}),
});

export type addArchetypeSchema = z.infer<typeof addArchetypeSchema>;

export const editArchetypeSchema = addArchetypeSchema.merge(withId);

export type editArchetypeSchema = z.infer<typeof editArchetypeSchema>;
