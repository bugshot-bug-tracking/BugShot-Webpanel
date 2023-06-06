import { Bug } from "./Bug";

export interface BugExport {
	id: string;
	type: "BugExport";
	attributes: {
		bug: Bug;
		evaluated_by?: string;
	};
}
