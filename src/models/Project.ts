import { Company } from "./Company";
import { Image } from "./Image";
import { Status } from "./Status";
import { User } from "./User";

export interface Project {
	id: string;
	type: string;
	attributes: {
		designation: string;
		company: Company;
		color_hex: string;
		url: string;
		created_at: Date;
		updated_at: Date;
		creator: User;
		bugsDone: number;
		bugsTotal: number;
		image?: Image;
		statuses?: Status[];
	};
}
