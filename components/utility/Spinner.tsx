import { Loader2 } from "lucide-react";

const Spinner = () => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<Loader2 className="animate-spin size-4 text-muted" />
		</div>
	);
};

export default Spinner;
