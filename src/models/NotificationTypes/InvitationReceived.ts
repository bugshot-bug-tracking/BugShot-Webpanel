export interface InvitationReceived {
	type: "InvitationReceived";
	data: {
		id: string;
		invited_to_type: string;
		invited_to: string;
		invited_by: string;

		invitable: {
			organization_id?: string;
			company_id?: string;
			project_id?: string;
		};

		created_at: string;
	};

	// front-end only
	status?: "accepted" | "declined";
}
