import { BugExport } from "./BugExport";
import { Project } from "./Project";
import { User } from "./User";

export interface Export {
	id: string;
	type: "Export";
	attributes: {
		exporter: User;
		project: Project;

		bugs: BugExport[];
		users?: User[];

		created_at: string;
		updated_at: string;
	};
}
