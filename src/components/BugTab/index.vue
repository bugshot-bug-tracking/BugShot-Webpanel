<template>
	<div>
		<SideTab v-if="bug" class="tab-shaddow">
			<Info
				:bug="bug"
				:status="status"
				@close="emit('close')"
				@open_assign="assignShow = true"
			/>

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

		<AssignModal
			v-if="assignShow"
			:id="bug.id"
			@close="assignShow = false"
		/>

		<div class="outside-overlay" @click="emit('close')" />
	</div>
</template>

<script setup>
import { useProjectStore } from "~/stores/project";
import axios from "axios";

const emit = defineEmits(["close", "deleted"]);
const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const store = useProjectStore();

const bug = computed(() => store.getBugById(props.id));
const status = computed(() =>
	store.getStatusById(bug.value.attributes.status_id)
);

// called on mount
store.fetchScreenshots(props.id);
store.fetchAttachments(props.id);
store.fetchComments(props.id);
store.fetchBugUsers(props.id);

// called on update
watch(bug, () => {
	if (!bug.value) return;
	store.fetchScreenshots(props.id);
	store.fetchAttachments(props.id);
	store.fetchComments(props.id);
	store.fetchBugUsers(props.id);
});

const deleteBug = async () => {
	try {
		await axios.delete(`statuses/${status.value.id}/bugs/${bug.value.id}`);

		status.value.attributes.bugs.splice(
			status.value.attributes.bugs.findIndex(
				(x) => x.id === bug.value.id
			),
			1
		);

		emit("close");
	} catch (error) {
		console.error(error);
	}
};

const assignShow = ref(false);
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
			background-image: url("/src/assets/icons/delete.svg");
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

.tab-shaddow {
	box-shadow: -10px 0px 24px hsla(231, 42%, 18%, 0.11);
}

.outside-overlay {
	position: fixed;
	width: 100vw;
	height: 100vh;
	background: #00000073;
	top: 0;
	left: 0;
	z-index: 1;
}
</style>
