import { GraduationCap, Presentation, Shield, User } from "lucide-react";

export const roleNames = {
	attending: "Účastník",
	teacher: "Učitel",
	presenting: "Prezentující",
	admin: "Administrátor",
};

export const getRoleIcon = (role: keyof typeof roleNames): React.ReactNode | null => {
	switch (role) {
		case "attending":
			return <User key={role} />;
		case "teacher":
			return <GraduationCap key={role} />;
		case "presenting":
			return <Presentation key={role} />;
		case "admin":
			return <Shield key={role} />;
		default:
			return null;
	}
};
