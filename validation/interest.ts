import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const expressInterestSchema = z.object({
	archetypeId: z.number(),
	isInterested: z.boolean(),
});

export type expressInterestSchema = z.infer<typeof expressInterestSchema>;

export const interestsActive = () => configuration.collectInterest && configuration.openClaimsOn > new Date();

export const canUserExpressInterest = (user: { isAttending: boolean }, numberOfInterests: number) => user.isAttending && (!configuration.maxInterests || numberOfInterests < configuration.maxInterests) && interestsActive();
