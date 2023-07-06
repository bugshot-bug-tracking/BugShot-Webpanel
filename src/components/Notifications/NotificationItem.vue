<script lang="ts">
import { h } from "vue";
import { Notification } from "~/models/Notification";
import InvitationReceived from "./InvitationReceived.vue";
import TaggedInComment from "./TaggedInComment.vue";
import ImplementationApprovalFormReceived from "./ImplementationApprovalFormReceived.vue";
import ApprovalReportReceived from "./ApprovalReportReceived.vue";
import CommentCreated from "./CommentCreated.vue";

export default {
	props: {
		data: {
			type: Object as PropType<Notification>,
			required: true,
		},
	},

	setup(props) {
		// return the render function
		return () => {
			switch (props.data.attributes.data.type) {
				case "InvitationReceived":
					return h(InvitationReceived, {
						value: props.data.attributes.data,
						notification_id: props.data.id,
					});

				case "TaggedInComment":
					return h(TaggedInComment, {
						value: props.data.attributes.data,
						notification_id: props.data.id,
					});

				case "ImplementationApprovalFormReceived":
					return h(ImplementationApprovalFormReceived, {
						value: props.data.attributes.data,
					});

				case "ApprovalReportReceived":
					return h(ApprovalReportReceived, {
						value: props.data.attributes.data,
					});

				case "CommentCreated":
					return h(CommentCreated, {
						value: props.data.attributes.data,
					});

				default:
					return undefined;
			}
		};
	},
};
</script>

<style lang="scss">
.notification-entry {
	display: grid;
	grid-template-areas:
		"header action"
		"footer action";
	grid-template-columns: 1fr auto;
	grid-template-rows: auto 1fr;
	gap: 0.25rem 1rem;
}

.notification-header {
	grid-area: header;
}
.notification-footer {
	grid-area: footer;
	font-size: 0.875rem;
}
.notification-action {
	grid-area: action;
	align-self: center;

	button {
		padding: 0.5rem;
	}
}
</style>
