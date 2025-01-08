export interface AppConfiguration {
	appName: string;
	appShortName?: string;
	appDescription: string;
	appThemeColor: string;
	SRGHBranding: boolean;
}

export interface UserPermissions {
	isAttending: boolean;
	isPresenting: boolean;
	isAdmin: boolean;
}

export type User = {
	id: number;
	microsoftId: string;
	name: string;
	email: string;
	colors: {
		light: string;
		dark: string;
	};
	class: string | null;
} & UserPermissions;

export type SessionUserRecord = {
	id: User["id"];
} & UserPermissions;
