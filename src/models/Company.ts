import { User } from "./User";
import { Project } from "./Project";
import { Role } from "./Role";

export interface Company {
	id: string;
	type: string;
	attributes: {
		designation: string;
		color_hex: string;
		created_at: Date;
		updated_at: Date;
		creator: User;
		projects?: Array<Project>;
		role?: Role;
	};
}
