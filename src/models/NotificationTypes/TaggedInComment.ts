export interface TaggedInComment {
	type: "TaggedInComment";
	data: {
		creator_name: string;
		organization_id: string;
		company_id: string;
		project_id: string;
		bug_id: string;
		comment_id: string;

		created_at: string;
	};
}
