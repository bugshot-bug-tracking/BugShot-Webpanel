import { Company } from "./Company";
import { Organization } from "./Organization";
import { Project } from "./Project";

export interface ApiToken {
	id: number;
	type: string;
	attributes: {
		api_tokenable: Organization | Company | Project;
		token: string;
		created_at: string;
		updated_at: string;
	};
}
