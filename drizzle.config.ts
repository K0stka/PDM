import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import { env } from "process";

export default defineConfig({
	out: "./db/",
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
});
