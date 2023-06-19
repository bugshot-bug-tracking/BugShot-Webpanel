export interface InvitationReceived {
	type: "InvitationReceived";
	data: {
		id: string;
		invited_to: string;
		invited_by: string;
		created_at: string;
	};

	// front-end only
	status?: "accepted" | "declined";
}
