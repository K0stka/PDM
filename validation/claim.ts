import { configuration } from "@/configuration/configuration";
import { z } from "zod";

export const saveClaimsSchema = z.array(
    z.object({
        block: z.number({ message: "ID bloku musí být číslo." }),
        primaryArchetype: z.number({
            message: "ID typu dílny musí být číslo.",
        }),
        secondaryArchetype: z
            .number({ message: "ID typu dílny musí být číslo." })
            .optional(),
    }),
);

export type saveClaimsSchema = z.infer<typeof saveClaimsSchema>;

export const adminSaveClaimsSchema = z.object({
    user: z.number({
        message: "ID uživatele musí být číslo.",
    }),
    claims: z.array(
        z.object({
            block: z.number({
                message: "ID bloku musí být číslo.",
            }),
            primaryArchetype: z
                .number({
                    message: "ID typu dílny musí být číslo.",
                })
                .nullable(),
            secondaryArchetype: z
                .number({ message: "ID typu dílny musí být číslo." })
                .nullable(),
        }),
    ),
});

export type adminSaveClaimsSchema = z.infer<typeof adminSaveClaimsSchema>;

export const claimsVisible = (user: { isAdmin: boolean }) =>
    user.isAdmin || configuration.openClaimsOn.getTime() < Date.now();

export const canEditClaimsNow = (user: { isAdmin: boolean }) =>
    (user.isAdmin || configuration.openClaimsOn.getTime() < Date.now()) &&
    configuration.closeClaimsOn.getTime() > Date.now();
