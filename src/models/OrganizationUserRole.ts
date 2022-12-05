import { Role } from "./Role";
import { User } from "./User";
import { Company } from "./Company";

export interface OrganizationUserRole {
	user: User;
	role: Role;
	subscription: any;
	companies?: { company: Company; role: Role }[];
}
