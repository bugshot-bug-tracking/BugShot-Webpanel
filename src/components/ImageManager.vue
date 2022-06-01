<template>
	<div class="main-container" v-if="uploadMode">
		<div
			class="upload-mode"
			@drop.prevent="drop"
			@dragenter.prevent="togleDragActive"
			@dragleave.prevent="togleDragActive"
			@dragover.prevent
			:class="{ active: active }"
			@change="change"
		>
			<div>
				<img src="/src/assets/icons/image_placeholder.svg" />
				<div class="text">{{ $t("screenshot.drag_and_drop") }}</div>
			</div>

			<label for="image-upload" class="btn bs be-green text-capitalize">
				{{ $t("picker.upload_image") }}
			</label>

			<input type="file" id="image-upload" multiple />
		</div>
	</div>

	<div class="main-container" v-else>
		<div class="preview-mode">
			<div class="main">
				<img :src="images[counter]" alt="image" />
			</div>

			<div class="bottom">
				<div class="slides mb-2">
					{{ counter + 1 + "/" + images.length }}
				</div>

				<div class="buttons">
					<div class="left">
						<a v-if="counter > 0" @click="counterDecrease">
							<img
								src="/src/assets/icons/icn_left_arrow.svg"
								alt="previous"
							/>
						</a>

						<div v-else style="width: 24px" />
					</div>

					<div class="center d-flex gap-3">
						<a @change="addImage">
							<label for="image-upload2" class="add">
								<img
									src="/src/assets/icons/add.svg"
									alt="add"
								/>
							</label>
							<input type="file" id="image-upload2" multiple />
						</a>

						<a class="delete" @click="removeImage">
							<img
								src="/src/assets/icons/trash.svg"
								alt="delete"
							/>
						</a>
					</div>

					<div class="right">
						<a
							v-if="counter < images.length - 1"
							@click="counterIncrease"
						>
							<img
								src="/src/assets/icons/icn_left_arrow.svg"
								alt="next"
							/>
						</a>

						<div v-else style="width: 24px" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import toBase64 from "../util/toBase64";

const emit = defineEmits(["update"]);

const uploadMode = computed(() => {
	return images.value.length === 0;
});

const files = ref([]); // raw files
const images = ref([]); // images from files

const active = ref(false);
const counter = ref(0);

const togleDragActive = () => {
	active.value = !active.value;
};

const drop = async (event) => {
	active.value = false;

	files.value = [];
	images.value = [];

	for (const file of event.dataTransfer.files) {
		if (!file || !file.type.includes("image")) continue;
		files.value.push(file);

		images.value.push(await toBase64(file));
	}

	emit("update", files.value);
};

const change = async (event) => {
	files.value = [];
	images.value = [];

	for (const file of event.target.files) {
		if (!file || !file.type.includes("image")) continue;
		files.value.push(file);

		images.value.push(await toBase64(file));
	}

	emit("update", files.value);
};

const addImage = async (event) => {
	for (const file of event.target.files) {
		if (!file || !file.type.includes("image")) continue;
		files.value.push(file);

		images.value.push(await toBase64(file));
	}

	emit("update", files.value);
};

const counterDecrease = () => {
	if (counter.value > 0) counter.value--;
};

const counterIncrease = () => {
	if (counter.value <= images.value.length) counter.value++;
};

const removeImage = () => {
	images.value.splice(counter.value, 1);
	files.value.splice(counter.value, 1);

	counter.value--;

	if (counter.value < 0) counter.value = 0;

	emit("update", files.value);
};
</script>

<style lang="scss" scoped>
.main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #f8f8fc;
	border: 1px solid #bc97f2;
	border-radius: 8px;
	width: 100%;
	min-height: 200px;
	position: relative;

	.upload-mode {
		width: 100%;
		height: 100%;
		min-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		gap: 1rem;
		padding: 20px;
		border-radius: 8px;

		&.active {
			background: #e4f8eb;
		}

		img {
			width: 42px;
			height: 42px;
			margin: 0;
		}
		.text {
			color: hsl(230, 43%, 73%);
			margin-top: 10px;
		}

		label {
			padding: 6px 12px;
			font-size: 1rem;
		}
	}

	.preview-mode {
		width: 100%;
		height: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;

		.main {
			position: relative;
			width: 90%;
			height: 60%;

			img {
				width: auto;
				height: auto;
				max-width: 100%;
				max-height: 100%;
				border-radius: 8px;
			}
		}

		.bottom {
			width: 90%;
			user-select: none;

			.slides {
				font-size: 14px;
			}

			.buttons {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			img {
				width: 24px;
				height: 24px;
			}

			.right {
				img {
					transform: rotateZ(180deg);
				}
			}

			.left,
			.right,
			.add {
				cursor: pointer;

				&:hover {
					// color:#18D992;
					filter: brightness(0) saturate(1) brightness(0) saturate(1)
						invert(63%) sepia(74%) saturate(493%) hue-rotate(104deg)
						brightness(96%) contrast(88%);
				}
			}

			.delete {
				cursor: pointer;

				&:hover {
					// color: #F23838;
					filter: brightness(0) saturate(1) invert(46%) sepia(28%)
						saturate(5216%) hue-rotate(331deg) brightness(87%)
						contrast(121%);
				}
			}
		}
	}
}

input {
	display: none;
}
</style>
