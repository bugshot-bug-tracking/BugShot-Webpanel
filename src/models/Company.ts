import { User } from "./User";
import { Project } from "./Project";

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
	};
}
