"use client";

import { Place } from "@/lib/types";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { deletePlace } from "@/actions/place";
import { pluralHelper } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";

interface DeletePlaceButtonProps {
	place: Place & { events: any[] };
}

const DeletePlaceButton = ({ place }: DeletePlaceButtonProps) => {
	const { action, pending } = useServerAction({
		action: deletePlace,
		successToast: "Místo bylo úspěšně odstraněno",
		errorToastTitle: "Místo se nepodařilo odstranit",
		loadingToast: "Odstraňuji místo",
	});

	const handleDelete = async () => {
		if (place.events.length > 0) return toast.error(`Místo nelze odstranit, protože se zde ${pluralHelper(place.events.length, "koná", "konají")} ${place.events.length} ${pluralHelper(place.events.length, "událost", "události", "událostí")}`);

		await action(place.id);
	};

	return (
		<ServerActionButton
			pending={pending}
			variant={place.events.length > 0 ? "secondary" : "destructive"}
			size="sm"
			onClick={handleDelete}>
			<Trash2 />
			Odstranit
		</ServerActionButton>
	);
};

export default DeletePlaceButton;
