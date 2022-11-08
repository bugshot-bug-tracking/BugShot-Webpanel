import { Company } from "./Company";
import { Project } from "./Project";
import { Role } from "./Role";
import { User } from "./User";

export interface Invitation {
	id: number;
	type: string;
	attributes: {
		sender: User;
		target_email: string;
		invitable: Project | Company;
		role: Role;
		status: {
			id: number;
			type: string;
			attributes: {
				designation: string;
			};
		};
		created_at: Date;
		updated_at: Date;
	};
}