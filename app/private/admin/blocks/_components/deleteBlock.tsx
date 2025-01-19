"use client";

import { Block } from "@/lib/types";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { deleteBlock } from "@/actions/block";
import { pluralHelper } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";

interface DeleteBlockButtonProps {
	block: Block & { events: any[] };
}

const DeleteBlockButton = ({ block }: DeleteBlockButtonProps) => {
	const { action, pending } = useServerAction({
		action: deleteBlock,
		successToast: "Blok byl úspěšně odstraněn",
		errorToastTitle: "Blok se nepodařilo odstranit",
		loadingToast: "Odstraňuji blok",
	});

	const handleDelete = async () => {
		if (block.events.length > 0) return toast.error(`Blok nelze odstranit, protože se zde ${pluralHelper(block.events.length, "koná", "konají")} ${block.events.length} ${pluralHelper(block.events.length, "událost", "události", "událostí")}`);

		await action(block.id);
	};

	return (
		<ServerActionButton
			pending={pending}
			variant={block.events.length > 0 ? "secondary" : "destructive"}
			size="sm"
			onClick={handleDelete}>
			<Trash2 />
			Odstranit
		</ServerActionButton>
	);
};

export default DeleteBlockButton;
