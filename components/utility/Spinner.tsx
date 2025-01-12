import { Loader2 } from "lucide-react";

interface SpinnerProps {
	inline?: true;
}

const Spinner = ({ inline }: SpinnerProps) => {
	return inline ? (
		<Loader2 className="animate-spin size-4 text-muted" />
	) : (
		<div className="flex h-full w-full items-center justify-center">
			<Loader2 className="animate-spin size-6 text-muted" />
		</div>
	);
};

export default Spinner;
