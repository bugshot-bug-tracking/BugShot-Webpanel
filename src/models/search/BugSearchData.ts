export interface BugSearchData {
	id: string;
	type: "Bug";
	attributes: {
		organization_id: string;
		company_id: string;
		project_id: string;
		designation: string;
		description: string;
		url?: string;
	};
}
