<script lang="ts">
import { h } from "vue";
import { Notification } from "~/models/Notification";
import InvitationReceived from "./events/InvitationReceived.vue";
import TaggedInComment from "./events/TaggedInComment.vue";
import ImplementationApprovalFormReceived from "./events/ImplementationApprovalFormReceived.vue";
import ApprovalReportReceived from "./events/ApprovalReportReceived.vue";
import CommentCreated from "./events/CommentCreated.vue";

export default {
	props: {
		data: {
			type: Object as PropType<Notification>,
			required: true,
		},
	},

	emits: ["delete"],

	setup(props, context) {
		// return the render function
		return () => {
			switch (props.data.attributes.data.type) {
				case "InvitationReceived":
					return h(InvitationReceived, {
						value: props.data.attributes.data,
						notification_id: props.data.id,
						onDelete: () => context.emit("delete"),
					});

				case "TaggedInComment":
					return h(TaggedInComment, {
						value: props.data.attributes.data,
						notification_id: props.data.id,
						onDelete: () => context.emit("delete"),
					});

				case "ImplementationApprovalFormReceived":
					return h(ImplementationApprovalFormReceived, {
						value: props.data.attributes.data,
						onDelete: () => context.emit("delete"),
					});

				case "ApprovalReportReceived":
					return h(ApprovalReportReceived, {
						value: props.data.attributes.data,
						onDelete: () => context.emit("delete"),
					});

				case "CommentCreated":
					return h(CommentCreated, {
						value: props.data.attributes.data,
						onDelete: () => context.emit("delete"),
					});

				default:
					return undefined;
			}
		};
	},
};
</script>
