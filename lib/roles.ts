import { UserPermissions } from "./types";
import { roleNames } from "@/configuration/roles";

export const getRoleName = (role: keyof typeof roleNames) => {
	return roleNames[role];
};

export const getUserRoleName = (user: UserPermissions) => {
	if (user.isAdmin) return getRoleName("admin");
	if (user.isPresenting) return getRoleName("presenting");
	if (user.isAttending) return getRoleName("attending");
};
