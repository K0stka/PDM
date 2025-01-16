import { asc, db, users as usersTable } from "@/db";

import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { User } from "@/lib/types";
import { UsersTable } from "./_components/table";
import { columns } from "./_components/columns";

const UsersPage: NextPage = async () => {
	const users = (await db.query.users.findMany({
		orderBy: asc(usersTable.name),
	})) as User[];

	return (
		<PageTemplate title="Správa uživatelů">
			<UsersTable
				columns={columns}
				data={users}
			/>
		</PageTemplate>
	);
};

export default UsersPage;
