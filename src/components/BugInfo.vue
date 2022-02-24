<template>
	<SideTab>
		<Info v-if="bug" :bug_id="bug_id" @close="$emit('close')" />

		<Attachments :attachments="bug.attachments" :bug_id="bug.id" />

		<Comments :comments="bug.comments" :bug_id="bug.id" />

		<div class="delete-btn-wrapper">
			<div class="btn delete-bug-btn" @click="deleteBug">
				<div class="delete-icon" />

				<span class="text-capitalize"> {{ $t("delete.bug") }} </span>
			</div>
		</div>
	</SideTab>
</template>

<script>
import { computed } from "@vue/reactivity";
import store from "../store";
import SideTab from "./SideTab.vue";
import Info from "./Info.vue";
import Attachments from "./Attachments/Index.vue";
import Comments from "./Comments/Index.vue";
import axios from "axios";

export default {
	components: {
		SideTab,
		Info,
		Attachments,
		Comments,
	},
	name: "InfoTab",
	props: {
		bug_id: {
			required: true,
			type: String,
		},
	},
	emits: ["close", "deleted"],
	setup(props, context) {
		const bug = computed(() => {
			return store.getters.getBugById(props.bug_id);
		});

		const deleteBug = async () => {
			try {
				let status = store.getters.getStatusById(
					bug.value.attributes.status_id
				);

				let r = await axios.delete(
					`statuses/${status.id}/bugs/${props.bug_id}`
				);

				let index = status.bugs.indexOf(bug.value.id);
				status.bugs.splice(index, 1);
				store.state.data.bugs.delete(bug.value.id);
				context.emit("close");
			} catch (error) {
				console.error(error);
			}
		};

		return {
			bug,
			deleteBug,
		};
	},
};
</script>

<style lang="scss" scoped>
.delete-btn-wrapper {
	display: inline-flex;
	align-items: center;
	justify-content: center;

	.btn.delete-bug-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		> .delete-icon {
			width: 24px;
			height: 24px;
			margin-right: 6px;
			background-image: url("../assets/icons/trash.svg");
			background-repeat: no-repeat;
			background-position: center;

			// color: #F23838; red
			filter: brightness(0) saturate(1) invert(46%) sepia(28%)
				saturate(5216%) hue-rotate(331deg) brightness(87%)
				contrast(121%);
		}

		> span {
			color: hsl(0, 90%, 60%);
			text-transform: capitalize;
			font-weight: 600;
			font-size: 20px;
		}
	}
}
</style>
