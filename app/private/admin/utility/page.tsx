import ClientUtilityPage from "./_components/clientPage";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const UtilityPage: NextPage = async () => {
    return (
        <PageTemplate title="Nástroje">
            <ClientUtilityPage />
        </PageTemplate>
    );
};

export default UtilityPage;
