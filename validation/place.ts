import { withId } from "./universal";
import { z } from "zod";

export const addPlaceSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Název místa je povinný",
		})
		.max(63, {
			message: "Název místa může mít maximálně 63 znaků",
		}),
});

export type addPlaceSchema = z.infer<typeof addPlaceSchema>;

export const editPlaceSchema = addPlaceSchema.merge(withId);

export type editPlaceSchema = z.infer<typeof editPlaceSchema>;
