export interface CommentCreated {
	type: "CommentCreated";
	data: {
		creator_name: string;
		organization_id: string;
		company_id: string;
		project_id: string;
		bug_id: string;
		comment_id: string;
		is_internal: boolean;
		created_at: string;
	};
}
