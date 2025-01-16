import { SquareCheck } from "lucide-react";

interface YesProps {
	withText?: boolean;
}

const Yes = ({ withText }: YesProps) => {
	return (
		<span>
			<SquareCheck className="bg-lime-500 text-white rounded size-5 mr-2" />
			{withText && "Ano"}
		</span>
	);
};

export default Yes;
