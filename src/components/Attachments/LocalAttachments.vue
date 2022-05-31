<template>
	<Container>
		<!-- <State :state="'mini-loading'" :show="isLoading.attachments" /> -->
		<div class="attachments">
			<div class="header">
				<div class="title">{{ $t("attachment", 2) }}</div>

				<div>
					<label id="file-label">
						<input
							type="file"
							style="width: 0; height: 0"
							multiple
							@change="checkFiles"
						/>
					</label>
				</div>
			</div>

			<div class="error" v-if="err != ''">
				<span style="white-space: pre-line">{{ err }}</span>
			</div>

			<div class="files" v-if="files">
				<div
					class="item"
					v-for="[index, item] of files.entries()"
					:key="index"
				>
					<Item
						:name="item.name"
						:id="index"
						:download="false"
						@delete="deleteFile"
					/>
				</div>
			</div>
		</div>
	</Container>
</template>

<script setup>
const emit = defineEmits(["update"]);

const err = ref("");
const files = ref([]); // raw file

const { t } = useI18n({ useScope: "global" });

const checkFiles = (event) => {
	let targetFiles = event.target.files;
	err.value = "";
	let errFlag = false;

	if (
		targetFiles.length > 10 ||
		files.value.length + targetFiles.length > 10
	) {
		err.value = t("limits.max_files_limit", { x: 10 });
		return;
	}

	Array.prototype.forEach.call(targetFiles, (file) => {
		// if the file is bigger than 5 MiB
		if (file.size > 5 * (1 << 20)) {
			if (errFlag === false) {
				errFlag = true;
				err.value = t("limits.max_file_size_limit", { x: 5 });
			}

			err.value += ` - ${file.name}\n`;
			return;
		}
		files.value.push(file);
	});

	if (errFlag == true) return;

	if (files.value.length > 0) emit("update", files.value);

	console.log(files.value);
};

const deleteFile = (index) => {
	files.value.splice(index, 1);
	emit("update", files.value);
};
</script>

<style lang="scss">
.attachments {
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
