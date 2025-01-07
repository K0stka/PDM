"use client";

import { User } from "@/lib/types";
import { createContext } from "react";

export const AuthContext = createContext<User>({} as User);

interface AuthProviderProps {
	children: React.ReactNode;
	user: User;
}

export const AuthProvider = ({ children, user }: AuthProviderProps) => {
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
