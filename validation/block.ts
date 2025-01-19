import { printDate, printDateTime, printTime } from "@/lib/utils";

import { z } from "zod";

export const addBlockSchema = z
	.object({
		from: z.date({
			message: "Zadejte platné datum",
		}),
		to: z.date({
			message: "Zadejte platné datum",
		}),
	})
	.refine((data) => data.from < data.to, {
		message: "Začátek bloku musí být dříve než jeho konec",
		path: ["to"],
	});

export type addBlockSchema = z.infer<typeof addBlockSchema>;

export const editBlockSchema = z
	.object({
		id: z.number({
			message: "Zadejte platné číslo",
		}),
		from: z.date({
			message: "Zadejte platné datum",
		}),
		to: z.date({
			message: "Zadejte platné datum",
		}),
	})
	.refine((data) => data.from < data.to, {
		message: "Začátek bloku musí být dříve než jeho konec",
		path: ["to"],
	});

export type editBlockSchema = z.infer<typeof editBlockSchema>;

export const getBlockName = (block: { from: Date; to: Date }) => {
	if (block.from.getDate() === block.to.getDate()) return `${printDate(block.from)}, ${printTime(block.from)} - ${printTime(block.to)}`;

	return `${printDateTime(block.from)} - ${printDateTime(block.to)}`;
};
