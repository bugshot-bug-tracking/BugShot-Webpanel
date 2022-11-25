import { Organization } from "./Organization";
import { Role } from "./Role";
import { User } from "./User";
import { Company } from "./Company";

export interface OrganizationUserRole {
	organization: Organization;
	user: User;
	role: Role;
	subscription: any;
	companies?: Company[];
}
