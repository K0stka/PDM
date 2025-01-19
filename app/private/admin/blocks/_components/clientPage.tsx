"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import AddBlock from "./addBlock";
import { Block } from "@/lib/types";
import { Button } from "@/components/ui/button";
import DeleteBlockButton from "./deleteBlock";
import EditBlock from "./editBlock";
import { EditBlockInfo } from "../page";
import PageTemplate from "@/components/utility/PageTemplate";
import { getBlockName } from "@/validation/block";
import { printDateTime } from "@/lib/utils";
import { useState } from "react";

interface BlocksClientPageProps {
	blocks: EditBlockInfo[];
}

const BlocksClientPage = ({ blocks }: BlocksClientPageProps) => {
	const [addBlockOpen, setAddBlockOpen] = useState(false);
	const [editBlockOpen, setEditBlockOpen] = useState(false);
	const [editBlock, setEditBlock] = useState<Block | null>(null);

	return (
		<PageTemplate
			title="Správa bloků"
			actions={[
				{
					id: "add",
					text: "Přidat blok",
					icon: <Plus />,
					onClick: () => setAddBlockOpen(true),
					props: {
						variant: "secondary",
					},
				},
			]}>
			<AddBlock
				open={addBlockOpen}
				onOpenChange={setAddBlockOpen}
			/>
			{editBlock && (
				<EditBlock
					open={editBlockOpen}
					onOpenChange={setEditBlockOpen}
					block={editBlock}
				/>
			)}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{blocks.map((block) => (
					<Card key={block.id}>
						<CardHeader>
							<CardTitle className="text-lg">{getBlockName(block)}</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted rounded p-2">{JSON.stringify(block.events, null, 2)}</pre>
						</CardContent>
						<CardFooter className="flex justify-end gap-2 flex-wrap">
							<DeleteBlockButton block={block} />
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setEditBlock(block);
									setEditBlockOpen(true);
								}}>
								Upravit
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</PageTemplate>
	);
};

export default BlocksClientPage;
