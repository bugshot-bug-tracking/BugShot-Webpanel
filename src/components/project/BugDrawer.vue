<template>
	<n-drawer v-model:show="active" :width="'30rem'" placement="right">
		<n-drawer-content>
			<n-scrollbar v-if="bug">
				<div p-2 mr-2 flex flex-col gap-4>
					<InfoStatic @close="active = false" :bug="bug">
						<template #screenshot>
							<Screenshot
								:screenshots="screenshots ?? []"
								:priority="bug.attributes.priority.id"
								tab-1
								:loading="store.screenshots == undefined"
							/>
						</template>
					</InfoStatic>

					<AttachmentsList
						:list="attachmentsList ?? []"
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

					<Comments :comments="comments ?? []" :bug_id="bug.id" />
				</div>
			</n-scrollbar>

			<template #footer v-if="false">
				<n-button text type="error" strong @click="deleteModal.open">
					<img
						src="/src/assets/icons/delete.svg"
						alt="delete"
						class="black-to-red"
						size="large"
					/>
					{{ $t("delete.bug") }}
				</n-button>
			</template>
		</n-drawer-content>

		<DeleteModal2
			:show="deleteModal.show"
			:header="deleteModal.header"
			:text="deleteModal.text"
			@close="deleteModal.clear"
			@delete="deleteBug"
			:callback="deleteBug"
			z-10000
		/>

		<LoadingModal2
			:show="loadingModal.show"
			:state="loadingModal.state"
			:message="loadingModal.message"
			@close="loadingModal.clear()"
		/>
	</n-drawer>
</template>

<script setup lang="ts">
import axios from "axios";
import { useReportsStore } from "~/stores/reports";

let store = useReportsStore();

const { t } = useI18n();

let bug = computed(() => {
	return store.getBug;
});

let active = computed({
	get: () => {
		return bug.value?.id ? true : false;
	},
	set: async () => {
		try {
			await store.setBug(undefined);
		} catch (error) {
			console.log(error);
		}
	},
});

const screenshots = computed(() => store.getScreenshots);
const attachmentsList = computed(() => store.getAttachments);
const comments = computed(() =>
	store.getComments?.sort((a, b) => {
		if (a.attributes.crated_at < b.attributes.crated_at) return -1;
		else if (a.attributes.crated_at > b.attributes.crated_at) return 1;
		return 0;
	})
);

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		if (files.length > 0) {
			files.forEach(async (file) => {
				try {
					let base64 = btoa((await toBase64(file)) as string);

					axios
						.post(`bugs/${bug.value.id}/attachments`, {
							designation: file.name,
							base64: base64,
						})
						.then(() => {
							attachments.update();
						});
				} catch (error: any) {
					attachments.error = error;
					console.log(error);
				}
			});
		}
	},

	download: (id: string) => {
		axios
			.get(`bugs/${bug.value.id}/attachments/${id}`, {
				headers: {
					"include-attachment-base64": "true",
				},
			})
			.then((response) => {
				const link = document.createElement("a");
				link.href = atob(response.data.data.attributes.base64);
				link.setAttribute("download", response.data.data.attributes.designation); //or any other extension
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
			.delete(`bugs/${bug.value.id}/attachments/${id}`)
			.then(() => {
				attachments.update();
			})
			.catch((error) => {
				console.log(error);
			});
	},

	update: () => {
		store.fetchAttachments();
	},
});

const assignShow = ref(false);

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
	open: () => {
		deleteModal.show = true;
		deleteModal.text = bug.value.attributes.designation;
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

const deleteBug = async () => {
	await store.deleteBug();
};

const loading = ref(true);
</script>

<style scoped></style>
