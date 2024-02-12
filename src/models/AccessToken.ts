export interface AccessToken {
	id: string;
	type: "AccessToken";
	attributes: {
		access_token: string;
		description: string;
		project_id: string;
		user_id: number;
		created_at: string;
		updated_at: string;
	};
}