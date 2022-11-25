import { Role } from "./Role";
import { User } from "./User";

export interface Organization {
	id: string;
	type: string;
	attributes: {
		designation: string;
		creator: User;
		role?: Role; // To be added in the API
		created_at: string;
		updated_at: string;
	};
}
