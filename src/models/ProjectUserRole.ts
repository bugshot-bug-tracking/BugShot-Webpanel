import { Project } from "./Project";
import { Role } from "./Role";
import { User } from "./User";

export interface ProjectUserRole {
	project: Project;
	user: User;
	role: Role;
}
