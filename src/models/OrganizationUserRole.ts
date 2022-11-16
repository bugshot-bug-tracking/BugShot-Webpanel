import { Organization } from "./Organization";
import { Role } from "./Role";
import { User } from "./User";

export interface OrganizationUserRole {
	organization: Organization;
	user: User;
	role: Role;
	subscription: any;
}
