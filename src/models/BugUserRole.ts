import { User } from "./User";
import { Role } from "./Role";
import { Bug } from "./Bug";

export interface BugUserRole {
	bug: Bug;
	user: User;
	role: Role;
}
