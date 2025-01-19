"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import AddPlace from "./addPlace";
import { Button } from "@/components/ui/button";
import DeletePlaceButton from "./deletePlace";
import EditPlace from "./editPlace";
import { EditPlaceInfo } from "../page";
import PageTemplate from "@/components/utility/PageTemplate";
import { Place } from "@/lib/types";
import { useState } from "react";

interface PlacesClientPageProps {
	places: EditPlaceInfo[];
}

const PlacesClientPage = ({ places }: PlacesClientPageProps) => {
	const [addPlaceOpen, setAddPlaceOpen] = useState(false);
	const [editPlaceOpen, setEditPlaceOpen] = useState(false);
	const [editPlace, setEditPlace] = useState<Place | null>(null);

	return (
		<PageTemplate
			title="Správa míst"
			actions={[
				{
					id: "add",
					text: "Přidat místo",
					icon: <Plus />,
					onClick: () => setAddPlaceOpen(true),
					props: {
						variant: "secondary",
					},
				},
			]}>
			<AddPlace
				open={addPlaceOpen}
				onOpenChange={setAddPlaceOpen}
			/>
			{editPlace && (
				<EditPlace
					open={editPlaceOpen}
					onOpenChange={setEditPlaceOpen}
					place={editPlace}
				/>
			)}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{places.map((place) => (
					<Card key={place.id}>
						<CardHeader>
							<CardTitle className="text-lg">{place.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted rounded p-2">{JSON.stringify(place.events, null, 2)}</pre>
						</CardContent>
						<CardFooter className="flex justify-end gap-2 flex-wrap">
							<DeletePlaceButton place={place} />
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setEditPlace(place);
									setEditPlaceOpen(true);
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

export default PlacesClientPage;
