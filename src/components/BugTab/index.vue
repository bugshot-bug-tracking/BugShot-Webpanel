<template>
	<div>
		<div v-if="bug" class="bs-tab bs-scroll" gap-4>
			<Info
				:bug="bug"
				:status="status"
				@close="emit('close')"
				@open_assign="assignShow = true"
			/>

			<AttachmentsList
				:list="bug.attachments ?? []"
				:error="attachments.error"
				@update="attachments.update"
				@upload="attachments.upload"
			>
				<template #item="{ item }">
					<AttachmentsItem
						:name="item.attributes.designation"
						:id="item.id"
						@download="attachments.download"
						@delete="attachments.delete"
					/>
				</template>
			</AttachmentsList>

			<Comments
				:comments="bug.comments ? bug.comments : []"
				:bug_id="id"
			/>

			<a class="delete-bug-btn black-to-red" @click="deleteAsk">
				<img src="/src/assets/icons/delete.svg" alt="delete" />

				{{ $t("delete.bug") }}
			</a>
		</div>

		<AssignModal v-if="assignShow" :id="id" @close="assignShow = false" />

		<div class="full-overlay" @click="emit('close')" />
	</div>

	<DeleteModal2
		:show="deleteModal.show"
		:header="deleteModal.header"
		:text="deleteModal.text"
		@close="deleteModal.clear"
		@delete="deleteBug"
	/>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="
			loadingModal.clear;
			emit('close');
		"
	/>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/project";
import axios from "axios";
import toBase64 from "~/util/toBase64";

const emit = defineEmits(["close", "deleted"]);
const props = defineProps({
	id: {
		required: true,
		type: String,
		description: "Bug ID",
	},
});

const { t } = useI18n();

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

const deleteAsk = async () => {
	if (!status.value || !bug.value) return console.log("Strange error!");

	deleteModal.show = true;
	deleteModal.text = bug.value.attributes.designation;
};

const deleteBug = async () => {
	if (!status.value || !bug.value) return console.log("Strange error!");

	deleteModal.clear();

	try {
		loadingModal.show = true;

		await axios.delete(`statuses/${status.value.id}/bugs/${bug.value.id}`);

		status.value.attributes.bugs?.splice(
			status.value.attributes.bugs.findIndex(
				(x) => x.id === bug.value?.id
			),
			1
		);

		loadingModal.state = 1;
	} catch (error) {
		console.error(error);

		loadingModal.state = 2;
	}
};

const assignShow = ref(false);

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		if (files.length > 0) {
			files.forEach(async (file) => {
				try {
					let base64 = btoa(await toBase64(file));

					axios
						.post(`bugs/${props.id}/attachments`, {
							designation: file.name,
							base64: base64,
						})
						.then(() => {
							attachments.update();
						});
				} catch (error: Error) {
					attachments.error = error;
					console.log(error);
				}
			});
		}
	},

	download: (id: string) => {
		axios
			.get(`bugs/${props.id}/attachments/${id}`, {
				headers: {
					"include-attachment-base64": "true",
				},
			})
			.then((response) => {
				const link = document.createElement("a");
				link.href = atob(response.data.data.attributes.base64);
				link.setAttribute(
					"download",
					response.data.data.attributes.designation
				); //or any other extension
				link.id = "downloadAttachmentA";
				document.body.appendChild(link);
				link.click();
				link.remove();
			})
			.catch((error) => {
				console.log(error);
			});
	},

	delete: (id: string) => {
		axios
			.delete(`bugs/${props.id}/attachments/${id}`)
			.then(() => {
				attachments.update();
			})
			.catch((error) => {
				console.log(error);
			});
	},

	update: () => {
		store.fetchAttachments(props.id);
	},
});

const deleteModal = reactive({
	show: false,
	text: "test",
	header: t("want_to_delete"),
	callback: null,
	clear: () => {
		deleteModal.show = false;
		deleteModal.text = "";
		deleteModal.callback = null;
	},
});

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});
</script>

<style lang="scss" scoped>
.delete-bug-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	text-transform: capitalize;
	font-weight: 600;
	font-size: 1.25rem;

	gap: 0.5rem;
}
</style>
