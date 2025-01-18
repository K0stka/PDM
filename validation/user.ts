import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const editUserSchema = z.object({
	id: z.number(),
	name: z.string({ message: "Neplatné jméno" }).min(3, { message: "Jméno je příliš krátké" }),
	email: z.string().email({ message: "Neplatný email" }),
	class: z.enum(configuration.validClasses, {
		message: "Neplatná třída",
	}),
	isAttending: z.boolean(),
	isTeacher: z.boolean(),
	isPresenting: z.boolean(),
	isAdmin: z.boolean(),
});

export type editUserSchema = z.infer<typeof editUserSchema>;
