import { Company } from "./Company";
import { Role } from "./Role";
import { User } from "./User";

export interface CompanyUserRole {
	company: Company;
	user: User;
	role: Role;
}
