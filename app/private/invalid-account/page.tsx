import InvalidAccountClientPage from "./_components/client";
import { NextPage } from "next";
import NotAttendingClientPage from "./_components/notAttending";
import { session } from "@/auth/session";

const InvalidAccountPage: NextPage = async () => {
    const user = await session();

    return (
        <div className="flex size-full items-center justify-center">
            {user.class ? (
                <NotAttendingClientPage />
            ) : (
                <InvalidAccountClientPage />
            )}
        </div>
    );
};

export default InvalidAccountPage;
