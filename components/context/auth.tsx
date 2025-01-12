"use client";

import { User } from "@/lib/types";
import { createContext } from "react";

export const UserContext = createContext<User>({} as User);

interface UserProviderProps {
	children: React.ReactNode;
	user: User;
}

export const UserProvider = ({ children, user }: UserProviderProps) => {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
