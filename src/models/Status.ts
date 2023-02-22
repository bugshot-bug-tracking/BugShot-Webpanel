import { Bug } from "./Bug";

export interface Status {
	id: string;
	type: string;
	attributes: {
		designation: string;
		order_number: number;
		bugs?: Bug[];
		permanent?: string;

		created_at: string;
		updated_at: string;
	};
}
