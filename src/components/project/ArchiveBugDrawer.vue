<template>
	<n-drawer v-model:show="active" :width="'30rem'" placement="right">
		<n-drawer-content>
			<n-scrollbar>
				<div p-2 mr-2 flex flex-col gap-4>
					<ArchiveBugInfo @close="active = false" />

					<div @click.capture.prevent="" style="opacity: 0.5" relative>
						<div absolute style="inset: 0; width: 100%; height: 100%; z-index: 1" />
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
					</div>

					<div @click.capture.prevent="" style="opacity: 0.5" relative>
						<div absolute style="inset: 0; width: 100%; height: 100%; z-index: 1" />

						<Comments
							v-if="store.bug"
							:comments="store.getComments"
							:bug_id="store.bug.id"
						/>
					</div>
				</div>
			</n-scrollbar>
		</n-drawer-content>
	</n-drawer>
</template>

<script setup lang="ts">
import axios from "axios";
import { useArchivedBugStore } from "~/stores/archivedBug";
import toBase64 from "~/util/toBase64";

let store = useArchivedBugStore();

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
</script>
