export interface CompaniesSearchData {
	id: string;
	type: "Company";
	attributes: {
		organization_id: string;
		designation: string;
	};
}
