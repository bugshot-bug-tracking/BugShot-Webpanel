export interface ImplementationApprovalFormReceived {
	type: "ImplementationApprovalFormReceived";
	data: {
		exporter_name: string;
		project_designation: string;
		url: string;
		created_at: string;
	};
}
