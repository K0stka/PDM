import { z } from "zod";

export const saveClaimsSchema = z.array(
    z.object({
        primaryClaim: z.object({
            id: z
                .number({
                    message: "ID musí být číslo.",
                })
                .nullable(),
            archetype: z.number({ message: "Typ dílny musí být číslo." }),
            block: z.number({ message: "ID bloku musí být číslo." }),
        }),
        secondaryClaim: z.object({
            id: z
                .number({
                    message: "ID musí být číslo.",
                })
                .nullable(),
            archetype: z.number({ message: "Typ dílny musí být číslo." }),
            block: z.number({ message: "ID bloku musí být číslo." }),
        }),
    }),
);

export type saveClaimsSchema = z.infer<typeof saveClaimsSchema>;
