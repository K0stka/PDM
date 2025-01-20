import { Card } from "@/components/ui/card";
import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";

const DisclaimerPage: NextPage = async () => {
    return (
        <PageTemplate title="Volba přednášek">
            <div className="flex size-full items-center justify-center">
                <Card className="p-4">
                    Omlouváme se, ale z technických důvodů byl začátek výběru
                    přednášek přesunut na 19:00.
                </Card>
            </div>
        </PageTemplate>
    );
};

export default DisclaimerPage;
