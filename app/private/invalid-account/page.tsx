import InvalidAccountClientPage from "./_components/client";
import { NextPage } from "next";

const InvalidAccountPage: NextPage = async () => {
	return (
		<div className="size-full flex items-center justify-center">
			<InvalidAccountClientPage />
		</div>
	);
};

export default InvalidAccountPage;
