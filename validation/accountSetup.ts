import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const accountSetupSchema = z.object({
	class: z.enum(configuration.validClasses).optional(),
	isTeacher: z.boolean().optional(),
});

export type accountSetupSchema = z.infer<typeof accountSetupSchema>;
