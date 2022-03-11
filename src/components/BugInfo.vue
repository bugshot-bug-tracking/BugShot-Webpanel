<template>
	<div ref="tab">
		<SideTab v-if="bug">
			<Info :bug="bug" :status="status" @close="$emit('close')" />

			<Attachments
				:attachments="bug.attachments ? bug.attachments : []"
				:bug_id="id"
			/>

			<Comments
				:comments="bug.comments ? bug.comments : []"
				:bug_id="id"
			/>

			<div class="delete-btn-wrapper">
				<div class="btn delete-bug-btn" @click="deleteBug">
					<div class="delete-icon" />

					<span class="text-capitalize">
						{{ $t("delete.bug") }}
					</span>
				</div>
			</div>
		</SideTab>
	</div>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from "@vue/runtime-core";
import store from "../store";
import SideTab from "./SideTab.vue";
import Info from "./Info.vue";
import Attachments from "./Attachments/Index.vue";
import Comments from "./Comments/Index.vue";
import axios from "axios";

const emit = defineEmits(["close", "deleted"]);
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const bug = computed(() => store.getters["kanban/getBugById"](props.id));
const status = computed(() =>
	store.getters["kanban/getStatusById"](bug.value.attributes.status_id)
);

// called on mount
store.dispatch("kanban/fetchScreenshots", props.id);
store.dispatch("kanban/fetchAttachments", props.id);
store.dispatch("kanban/fetchComments", props.id);

// called on update
watch(bug, () => {
	if (!bug.value) return;
	store.dispatch("kanban/fetchScreenshots", props.id);
	store.dispatch("kanban/fetchAttachments", props.id);
	store.dispatch("kanban/fetchComments", props.id);
});

const deleteBug = async () => {
	try {
		await axios.delete(`statuses/${status.value.id}/bugs/${bug.value.id}`);

		store.commit("kanban/REMOVE_LINK", {
			status_id: status.value.id,
			bug_id: bug.value.id,
		});
		store.commit("kanban/DELETE_BUG", bug.value.id);

		emit("close");
	} catch (error) {
		console.error(error);
	}
};

//#region  close on lick outside logic

const tab = ref(null);

const closeTab = (event) => {
	if (!tab.value) return;

	// event.path for chromium, composedPath for when .path does not exist (ex. firefox)
	let path = event.path || (event.composedPath && event.composedPath());

	// exclude clicking elements inside, bug-cards and download attachment that happens outside the tab
	if (
		path.find((e) => e == tab.value) == null &&
		path.find((e) => e.className?.includes("bug-card")) == null &&
		event.target.id != "downloadAttachmentA"
	)
		emit("close");
};

document.addEventListener("click", closeTab);

onUnmounted(() => {
	document.addEventListener("click", closeTab);
});

//#endregion
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
