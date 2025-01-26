import ClientClaims from "./_components/clientPage";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const ClaimsPage: NextPage = async () => {
    return (
        <PageTemplate title="Volba přednášek">
            <ClientClaims />
        </PageTemplate>
    );
};

export default ClaimsPage;
