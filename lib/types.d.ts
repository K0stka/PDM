export type AppConfiguration = Readonly<{
	appName: string;
	appShortName?: string;
	appDescription: string;
	appThemeColor: string;
	SRGHBranding: boolean;
	collectInterest: boolean;
	maxInterests: number | null;
	interestsCTA: string | null;
	collectAttendance: boolean;
	openClaimsOn: Date;
	closeClaimsOn: Date;
	validClasses: [string, ...string[]];
}>;

export interface UserPermissions {
	isAttending: boolean;
	isTeacher: boolean;
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

export type Session = {
	id: User["id"];
} & UserPermissions;

export type Archetype = {
	id: number;
	name: string;
	description: string;
};

export type Block = {
	id: number;
	from: Date;
	to: Date;
};

export type Place = {
	id: number;
	name: string;
};

export type Event = {
	id: number;
	archetype: Archetype;
	block: Block;
	place: Place;
	capacity: number;
};

export type Presenter = {
	id: number;
	user: User;
	event: Event;
};

export type Interest = {
	id: number;
	user: User;
	archetype: Archetype;
};

export type Claim = {
	id: number;
	user: User;
	archetype: Archetype;
	block: Block;
	timestamp: Date;
};

export type Attendance = {
	id: number;
	user: User;
	event: Event;
	wasPresent: boolean;
};
