import { User } from "./User";

export interface Bug {
	id: string;
	type: string;
	attributes: {
		ai_id: number;
		browser: string;
		created_at: Date;
		creator: User;
		deadline: Date;
		description: string;
		designation: string;
		operating_system: string;
		order_number: number;
		priority: Object;
		project_id: string;
		resolution: string;
		selector: string;
		status_id: string;
		updated_at: Date;
		url: URL | string;
	};
}
