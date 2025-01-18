import { asc, db, users as usersTable } from "@/db";

import { NextPage } from "next";
import PageTemplate from "@/components/utility/PageTemplate";
import { User } from "@/lib/types";
import { UsersTable } from "./_components/table";

const UsersPage: NextPage = async () => {
	const users = (await db.query.users.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			colors: true,
			class: true,
			isAttending: true,
			isTeacher: true,
			isPresenting: true,
			isAdmin: true,
		},
		orderBy: asc(usersTable.name),
	})) as User[];

	return (
		<PageTemplate title="Správa uživatelů">
			<UsersTable data={users} />
		</PageTemplate>
	);
};

export default UsersPage;
