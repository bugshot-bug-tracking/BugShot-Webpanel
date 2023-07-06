import { ApprovalReportReceived } from "./NotificationTypes/ApprovalReportReceived";
import { ImplementationApprovalFormReceived } from "./NotificationTypes/ImplementationApprovalFormReceived";
import { InvitationReceived } from "./NotificationTypes/InvitationReceived";
import { TaggedInComment } from "./NotificationTypes/TaggedInComment";
import { CommentCreated } from "./NotificationTypes/CommentCreated";

export interface Notification {
	id: string;
	type: "Notification";
	attributes: {
		type: string;
		notifiable_type: string;
		notifiable_id: number;

		data:
			| InvitationReceived
			| TaggedInComment
			| ImplementationApprovalFormReceived
			| ApprovalReportReceived
			| CommentCreated;
	};
}
