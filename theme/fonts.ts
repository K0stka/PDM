import { Hepta_Slab, Nunito } from "next/font/google";

export const nunito = Nunito({
  preload: true,
  subsets: ["latin", "latin-ext"],
  weight: "700",
  variable: "--f-nunito",
});

export const heptaSlab = Hepta_Slab({
  preload: true,
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--f-hepta-slab",
});
