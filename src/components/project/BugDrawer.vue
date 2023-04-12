<template>
	<n-drawer v-model:show="active" :width="'30rem'" placement="right">
		<n-drawer-content>
			<n-scrollbar>
				<div p-2 mr-2 flex flex-col gap-4>
					<BugInfo @close="active = false" />

					<AttachmentsList
						v-if="store.bug"
						:list="store.getAttachments"
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

					<BugComments
						:list="store.getComments"
						:loading="store.loading && store.loading_comments"
						:submit="submitComment"
					/>
				</div>
			</n-scrollbar>

			<template #footer>
				<n-popconfirm v-model:show="popover.value" :show-icon="false" m-4>
					<template #trigger>
						<n-button text type="error" strong :disabled="store.loading_delete_bug">
							<img
								src="/src/assets/icons/delete.svg"
								alt="delete"
								class="black-to-red"
								size="large"
							/>

							{{ $t("delete.bug") }}
						</n-button>
					</template>

					<div m-4>{{ t("want_to_delete_this_bug") }}</div>

					<template #action>
						<div flex gap-2 my-2 mx-4>
							<n-button
								type="success"
								ghost
								strong
								@click="popover.close"
								:disabled="store.loading_delete_bug"
							>
								{{ $t("cancel") }}
							</n-button>

							<n-button
								type="error"
								@click="deleteBug"
								:disabled="store.loading_delete_bug"
								:loading="store.loading_delete_bug"
							>
								{{ $t("delete.delete") }}
							</n-button>
						</div>
					</template>
				</n-popconfirm>
			</template>
		</n-drawer-content>
	</n-drawer>
</template>

<script setup lang="ts">
import axios from "axios";
import { useBugStore } from "~/stores/bug";
import toBase64 from "~/util/toBase64";

let store = useBugStore();

const { t } = useI18n();

let active = computed({
	get: () => {
		return store.active;
	},
	set: async () => {
		try {
			await store.init(undefined, "");
		} catch (error) {
			console.log(error);
		}
	},
});

const attachments = reactive({
	error: "",

	upload: (files: File[]) => {
		if (files.length > 0) {
			files.forEach(async (file) => {
				try {
					let base64 = btoa((await toBase64(file)) as string);

					axios
						.post(`bugs/${store.bug!.id}/attachments`, {
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
			.get(`bugs/${store.bug!.id}/attachments/${id}`, {
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
			.delete(`bugs/${store.bug!.id}/attachments/${id}`)
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

const popover = reactive({
	value: false,
	close: () => {
		popover.value = false;
	},
});

const deleteBug = async () => {
	await store.deleteBug();
	popover.close();
};

const submitComment = async (message: string, users: number[]) => {
	await store.createComment({ message: message, users: users.map((u) => ({ user_id: u })) });
};
</script>
