"use client";

import { Block } from "@/lib/types";
import { EditBlockInfo } from "../page";
import ServerActionButton from "@/components/utility/ServerActionButton";
import { Trash2 } from "lucide-react";
import { deleteBlock } from "@/actions/block";
import { pluralHelper } from "@/lib/utils";
import { toast } from "sonner";
import { useServerAction } from "@/hooks/use-server-action";

interface DeleteBlockButtonProps {
    block: EditBlockInfo;
}

const DeleteBlockButton = ({ block }: DeleteBlockButtonProps) => {
    const { action, pending } = useServerAction({
        action: deleteBlock,
        successToast: "Blok byl úspěšně odstraněn",
        errorToastTitle: "Blok se nepodařilo odstranit",
        loadingToast: "Odstraňuji blok",
    });

    const handleDelete = async () => {
        if (block.events > 0)
            return toast.error(
                `Blok nelze odstranit, protože se zde ${pluralHelper(block.events, "koná", "konají")} ${block.events} ${pluralHelper(block.events, "událost", "události", "událostí")}`,
            );

        await action(block.id);
    };

    return (
        <ServerActionButton
            pending={pending}
            variant={block.events > 0 ? "secondary" : "destructive"}
            size="icon"
            onClick={handleDelete}
        >
            <Trash2 />
        </ServerActionButton>
    );
};

export default DeleteBlockButton;
