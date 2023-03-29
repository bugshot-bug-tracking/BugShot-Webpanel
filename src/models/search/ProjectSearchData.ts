export interface ProjectSearchData {
	id: string;
	type: "Project";
	attributes: {
		organization_id: string;
		company_id: string;
		designation: string;
		url: any;
	};
}
