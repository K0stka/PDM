import { AppConfiguration } from "@/lib/types";

export const configuration: AppConfiguration = {
    appName: "Přednáškový den",
    appShortName: "Přednáškový den",
    appDescription: "Aplikace SRGH pro usnadnění organizace Přednáškového dne",
    appThemeColor: "#001c2e",
    SRGHBranding: true,

    collectInterest: true,
    maxInterests: 2,
    interestsCTA:
        "U až dvou přednášek máte možnost vyjádřit svůj předběžný (nezávazný) zájem. Tím nám pomůžete správně naplánovat kapacitu místností a přispějete plynulosti akce.",

    collectAttendance: false,

    openClaimsOn: new Date("2025-01-27T17:00:00Z"), // UTC
    closeClaimsOn: new Date("2025-01-28T09:00:00Z"), // UTC
    secondaryClaims: true,

    validClasses: [
        "I.A4",
        "I.B4",
        "II.A4",
        "II.B4",
        "III.A4",
        "III.B4",
        "IV.A4",
        "IV.B4",
        "I.A6",
        "I.B6",
        "II.A6",
        "II.B6",
        "III.A6",
        "III.B6",
        "IV.A6",
        "IV.B6",
        "V.A6",
        "V.B6",
        "V.C6",
        "VI.A6",
        "VI.B6",
        "I.A8",
        "I.B8",
        "II.A8",
        "II.B8",
        "III.A8",
        "III.B8",
        "IV.A8",
        "IV.B8",
        "V.A8",
        "VI.A8",
        "VI.B8",
        "VII.A8",
        "VIII.A8",
        "VIII.B8",
    ],
};
