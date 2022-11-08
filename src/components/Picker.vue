<template>
	<div class="picker">
		<div class="header">
			<div class="buttons">
				<a :class="{ active: pickOption === 1 }" @click="pickOption = 1">
					{{ $t("image") }}
				</a>

				<a :class="{ active: pickOption === 2 }" @click="pickOption = 2">
					{{ $t("color") }}
				</a>
			</div>
		</div>

		<div
			class="pick-container"
			@drop.prevent="drop"
			@dragenter.prevent="toggleDragActive"
			@dragleave.prevent="toggleDragActive"
			@dragover.prevent
			:class="{ active: active }"
		>
			<div class="image" v-show="pickOption === 1" @change="change">
				<div class="empty" v-if="imgg === ''">
					<div text-center>
						<img src="/src/assets/icons/image.svg" class="black-to-gray" />

						<div class="text">
							{{ $t("picker.drag_and_drop") }}
						</div>
					</div>

					<label for="pick-upload" class="bs-btn green empty">
						{{ $t("picker.upload_image") }}
					</label>

					<input type="file" name="upload" id="pick-upload" ref="picker" />
				</div>

				<div class="preview" v-else>
					<div class="image-container">
						<img :src="imgg" />
					</div>

					<a class="bs-btn green empty" @click="resetImage">
						{{ $t("remove") }}
					</a>
				</div>
			</div>

			<div class="color" v-show="pickOption === 2">
				<span>
					{{ $t("picker.select_color") + ":" }}
				</span>

				<div class="colors-grid">
					<input
						type="radio"
						name="colorOptions"
						v-model="colorPicked"
						v-for="(color, index) of colors"
						:key="'c' + index"
						:value="index"
						:style="{ color: color }"
						class="col-option"
						@change="colorChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import colors from "~/util/colors";

const props = defineProps({
	colorPicked: {
		required: true,
		type: Number,
		default: 3,
	},

	image: {
		type: String,
	},
});

// const emit = defineEmits(["setImage", "setColor"]);
const emit = defineEmits<{
	(e: "setImage", file: File | null): void;
	(e: "setColor", value: number): void;
}>();

const pickOption = ref(1);

const active = ref(false);

const toggleDragActive = () => {
	active.value = !active.value;
};

const drop = (event: DragEvent) => {
	active.value = false;
	pickOption.value = 1;

	let file = event.dataTransfer?.files[0];
	if (!file || !file.type.includes("image")) {
		imgg.value = "";
		return;
	}

	emit("setImage", file);

	imgg.value = URL.createObjectURL(file);
};

const imgg = ref("");

if (props.image && props.image.length > 20) imgg.value = props.image;

const resetImage = () => {
	imgg.value = "";
	emit("setImage", null);
	picker.value = null;
};

const change = (event: Event) => {
	let file = (event.target as HTMLInputElement)?.files;

	if (!file || !file[0].type.includes("image")) {
		imgg.value = "";
		return;
	}

	emit("setImage", file[0]);

	imgg.value = URL.createObjectURL(file[0]);
};

const colorChange = () => {
	emit("setColor", Number(props.colorPicked));
};

const picker = ref(null);
</script>

<style lang="scss" scoped>
.picker {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	min-width: 22rem;

	.header {
		margin-bottom: 1.25rem;
		width: 100%;
		display: flex;
		justify-content: center;
		text-align: center;

		.buttons {
			display: flex;
			width: 100%;
			justify-content: space-around;
			border: 1px solid #5916b9;
			border-radius: 0.5rem;
			font-size: 1rem;

			& > :first-child {
				border-radius: 0.375rem 0 0 0.375rem;
			}

			& > :last-child {
				border-radius: 0 0.375rem 0.375rem 0;
			}

			> .active {
				background-color: #5916b9;
				color: hsl(0, 0%, 100%);
			}

			> a {
				width: 100%;
				padding: 0.375rem;
				cursor: pointer;
			}
		}
	}

	> .pick-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: #f8f8fc 0% 0% no-repeat padding-box;
		border: 1px solid #bc97f2;
		border-radius: 0.5rem;
		width: 100%;
		height: 15.5rem;
		padding: 1.25rem;
		position: relative;

		&.active {
			background: #e4f8eb 0% 0% no-repeat padding-box;
		}

		.image {
			width: 100%;
			height: 100%;

			> .empty {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-evenly;

				img {
					width: 3rem;
					height: 3rem;
					margin: 0;
				}
			}

			.preview {
				width: 100%;
				height: 100%;
				margin: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				.image-container {
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;
					position: relative;
					width: 100%;
					height: 70%;

					img {
						width: auto;
						height: auto;
						max-width: 100%;
						max-height: 100%;
						border-radius: 0.5rem;
					}
				}
			}

			> * {
				margin: 0.5rem 0;
			}

			.text {
				color: hsl(230, 43%, 73%);
				margin-top: 0.5rem;
			}

			input {
				display: none;
			}
		}

		> .color {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 75%;
			justify-content: space-evenly;
			margin-bottom: 1.25rem;

			> span {
				font-size: 1.125rem;
			}

			> .colors-grid {
				width: 100%;
				display: grid;
				column-gap: 0.75rem;
				grid-template-columns: repeat(auto-fit, 2rem);
				justify-content: center;
				justify-items: center;
			}

			.col-option {
				appearance: none;
				width: 1.5rem;
				height: 1.5rem;
				background-color: currentColor;
				border-radius: 100%;
				cursor: pointer;

				&:checked {
					background-image: url("/src/assets/icons/check-white.svg");
					background-repeat: no-repeat;
					background-position: center;
					background-size: 65%;

					outline: 0.375rem solid;
					outline-offset: -1px;
					outline-color: currentColor;
				}
			}
		}
	}
}
</style>
