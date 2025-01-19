import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const editUserSchema = z.object({
	id: z.number(),
	name: z.string({ message: "Neplatné jméno" }).min(3, { message: "Jméno musí mít minimálně 3 znaky" }).max(255, { message: "Jméno může mít maximálně 255 znaků" }),
	email: z.string().email({ message: "Neplatný email" }).max(255, { message: "Email může mít maximálně 255 znaků" }),
	class: z.enum(configuration.validClasses, {
		message: "Neplatná třída",
	}),
	isAttending: z.boolean(),
	isTeacher: z.boolean(),
	isPresenting: z.boolean(),
	isAdmin: z.boolean(),
});

export type editUserSchema = z.infer<typeof editUserSchema>;
