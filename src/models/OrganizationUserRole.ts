import { Role } from "./Role";
import { User } from "./User";
import { Company } from "./Company";

export interface OrganizationUserRole {
	user: User;
	role: Role;
	companies?: { company: Company; role: Role }[];
}
