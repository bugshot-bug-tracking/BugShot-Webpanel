<template>
	<Container>
		<!-- <State :state="'mini-loading'" :show="isLoading.attachments" /> -->
		<div id="attachments">
			<div class="header">
				<div class="title">{{ $t("attachment", 2) }}</div>

				<div>
					<div class="btn refresh-button" @click="update" />
					<label id="file-label">
						<input
							type="file"
							style="width: 0; height: 0"
							multiple
							@change="upload"
						/>
					</label>
				</div>
			</div>

			<div class="error" v-if="err != ''">
				<span style="white-space: pre-line">{{ err }}</span>
			</div>

			<div class="files">
				<div class="item" v-for="item in attachments" :key="item.id">
					<Item
						:name="item.attributes.designation"
						:id="item.id"
						@download="downloadFile"
						@delete="deleteFile"
					/>
				</div>
			</div>
		</div>
	</Container>
</template>

<script>
import { ref } from "@vue/reactivity";
import Container from "../Container.vue";
import Item from "./Item.vue";
import axios from "axios";
import store from "../../store";
import { useI18n } from "vue-i18n";
import toBase64 from "@/util/toBase64";

export default {
	components: { Container, Item },
	name: "Attachments",
	props: {
		attachments: {
			required: true,
			type: Array,
		},
		bug_id: {
			required: true,
			type: String,
		},
	},
	setup(props, context) {
		const err = ref("");
		const files = ref({});

		const { t } = useI18n({ useScope: "global" });

		const upload = (event) => {
			files.value = event.target.files;
			err.value = "";

			let fileInfos = [];
			let errFlag = false;

			if (
				files.value.length > 10 ||
				props.attachments.length + files.value.length > 10
			) {
				err.value = t("limits.max_files_limit", { x: 10 });
				return;
			}

			Array.prototype.forEach.call(files.value, (file) => {
				// if the file is bigger than 5 MiB
				if (file.size > 5 * (1 << 20)) {
					if (errFlag === false) {
						errFlag = true;
						err.value = t("limits.max_file_size_limit", { x: 5 });
					}

					err.value += ` - ${file.name}\n`;
					return;
				}

				fileInfos.push(file);
			});

			if (errFlag == true) return;

			uploadRemote(fileInfos);
		};

		const uploadRemote = (filesInfo) => {
			if (filesInfo.length > 0) {
				filesInfo.forEach(async (file) => {
					try {
						let base64 = btoa(await toBase64(file));

						axios
							.post(`bugs/${props.bug_id}/attachments`, {
								designation: file.name,
								base64: base64,
							})
							.then(() => {
								update();
							});
					} catch (error) {
						err.value = error;
						console.error(error);
					}
				});
			}
		};

		const downloadFile = (id) => {
			axios
				.get(`bugs/${props.bug_id}/attachments/${id}`, {
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
				});
		};

		const deleteFile = (id) => {
			try {
				axios
					.delete(`bugs/${props.bug_id}/attachments/${id}`)
					.then(() => {
						update();
					});
			} catch (error) {
				err.value = error;
				console.error(error);
			}
		};

		const update = () => {
			store.dispatch("kanban/fetchAttachments", props.bug_id);
		};

		return {
			err,
			upload,
			downloadFile,
			deleteFile,
			update,
		};
	},
};
</script>

<style lang="scss">
#attachments {
	> .header {
		display: inline-flex;
		justify-content: space-between;
		width: 100%;

		.title {
			font-weight: 500;
			font-size: 20px;
		}

		label#file-label {
			cursor: pointer;
			transition: 0.3s;
			background-image: url("../../assets/icons/attachment.svg");
			background-repeat: no-repeat;
			width: 32px;
			height: 32px;
			filter: brightness(0) saturate(1) invert(63%) sepia(74%)
				saturate(493%) hue-rotate(104deg) brightness(96%) contrast(88%);
			//   color: #18d891;

			&:hover {
				filter: brightness(0) saturate(1) invert(18%) sepia(72%)
					saturate(5384%) hue-rotate(263deg) brightness(94%)
					contrast(92%);
				// color: #7118d8;
			}
		}

		.refresh-button {
			background-image: url("../../assets/icons/refresh.svg");
			background-repeat: no-repeat;
			background-position: center;
			width: 24px;
			height: 24px;
			margin-right: 10px;

			&:hover {
				filter: brightness(0) saturate(1) invert(55%) sepia(54%)
					saturate(630%) hue-rotate(106deg) brightness(112%)
					contrast(90%);
			}
		}
	}

	> .error {
		color: hsl(0, 90%, 60%);
		font-weight: 500;
		padding-bottom: 10px;
		border-bottom: 1px solid hsl(240, 100%, 95%);
	}

	> .files {
		margin-top: 5px;

		> .item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 8px 15px;
			background: transparent;
			transition: 0.3s;

			&:hover {
				background: hsl(158, 79%, 87%);
				border-radius: 8px;

				> .controls {
					transition: 0.3s;
					opacity: 1;
				}
			}
		}
	}
}
</style>
