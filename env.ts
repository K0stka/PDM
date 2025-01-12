import "server-only";

import { z } from "zod";

export const env = z
	.object({
		DATABASE_URL: z.string().readonly(),
		AUTH_CALLBACK_URL: z.string().readonly(),
		AUTH_SECRET: z.string().readonly(),
		MICROSOFT_CLIENT_ID: z.string().readonly(),
		MICROSOFT_CLIENT_SECRET: z.string().readonly(),
		MICROSOFT_TENANT_ID: z.string().readonly(),
		OFFLINE_MODE: z
			.enum(["true", "false"])
			.transform((e) => e === "true")
			.readonly(),
	})
	.parse(process.env);
