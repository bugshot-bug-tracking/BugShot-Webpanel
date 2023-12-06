import { Role } from "./Role";

export interface User {
	id: number;
	type: string;
	attributes: {
		email: string;
		first_name: string;
		last_name: string;
		phone?: string;
		trial_end_date?: string;
		admin: boolean;
	};
	role?: Role;
}
