import { User } from "./User";
import { Project } from "./Project";
import { Role } from "./Role";
import { Invitation } from "./Invitation";
import { Image } from "./Image";
import { Organization } from "./Organization";

export interface Company {
	id: string;
	type: string;
	attributes: {
		designation: string;
		color_hex: string;
		created_at: string;
		updated_at: string;
		creator?: User;
		projects?: Array<Project>;
		role?: Role;
		users?: User[];
		image?: Image;
		organization: Organization;

		// received using header
		organization_id?: string;
	};
	pending?: Invitation[];
}
