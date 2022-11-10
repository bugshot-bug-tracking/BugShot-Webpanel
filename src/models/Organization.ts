import { User } from "./User";

export interface Organization {
	id: string;
	type: string;
	attributes: {
		designation: string;
		creator: User;
		created_at: string;
		updated_at: string;
	};
}
