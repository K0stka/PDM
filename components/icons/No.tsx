import { SquareX } from "lucide-react";

interface NoProps {
	withText?: boolean;
}

const No = ({ withText }: NoProps) => {
	return (
		<span>
			<SquareX className="bg-red-500 text-white rounded size-5 mr-2" />
			{withText && "Ne"}
		</span>
	);
};

export default No;
