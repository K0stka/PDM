"use client";

import ServerActionButton from "@/components/utility/ServerActionButton";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { expressInterest } from "@/actions/interest";
import { motion } from "framer-motion";
import { useServerAction } from "@/hooks/use-server-action";

interface InterestButtonProps {
    archetypeId: number;
    isInterested?: boolean;
}

const InterestButton = ({ archetypeId, isInterested }: InterestButtonProps) => {
    const { action, pending } = useServerAction({
        action: expressInterest,
        errorToastTitle: "Při ukládání zájmu došlo k chybě",
        successToast: false,
        loadingToast: false,
    });

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ServerActionButton
                pending={pending}
                onClick={() =>
                    action({ archetypeId, isInterested: !isInterested })
                }
                variant={isInterested ? "default" : "outline"}
                size="sm"
                className={cn({
                    "bg-yellow-500 text-black": isInterested,
                })}
            >
                <ThumbsUp />
                Toto mě zajímá
            </ServerActionButton>
        </motion.div>
    );
};

export default InterestButton;
