export interface ApprovalReportReceived {
	type: "ApprovalReportReceived";
	data: {
		evaluator_name: string;
		file_path: string;
		created_at: string;
	};
}
