<template>
	<div class="picker">
		<div class="header">
			<div class="buttons">
				<a
					class="btn"
					:class="{ active: pickOption === 1 }"
					@click="pickOption = 1"
				>
					Image
				</a>

				<a
					class="btn"
					:class="{ active: pickOption === 2 }"
					@click="pickOption = 2"
				>
					Color
				</a>
			</div>
		</div>

		<div
			class="pick-container"
			@drop.prevent="drop"
			@dragenter.prevent="togleDragActive"
			@dragleave.prevent="togleDragActive"
			@dragover.prevent
			:class="{ active: active }"
		>
			<div class="image" v-show="pickOption === 1" @change="change">
				<img
					v-if="imgg === null"
					src="../assets/icons/image_placeholder.svg"
				/>
				<img v-else :src="imgg" />

				<div class="text">Drag and drop your logo here or</div>

				<label for="pick-upload" class="btn bs be-green">
					Upload Logo
				</label>

				<input type="file" name="upload" id="pick-upload" />

				<img
					v-if="imgg !== null"
					class="reset-img"
					src="../assets/icons/classic_X.svg"
					@click="resetImage"
				/>
			</div>

			<div class="color" v-show="pickOption === 2">
				<span>Select a color:</span>

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

<script>
import { ref } from "@vue/reactivity";
export default {
	name: "Picker",
	props: {
		colorPicked: {
			required: true,
			type: Number,
			default: 3,
		},
	},
	setup(props, context) {
		const pickOption = ref(1);

		const colors = [
			"#F23838", // red
			"#F66808", // orange
			"#FFB157", // yellow
			"#7A2EE6", // purple <- default [3]
			"#15BE80", // green
			"#1849CF", // blue
			"#89A3EB", // gray
		];

		const enambleColoorChange = ref(false);

		const active = ref(false);

		const togleDragActive = () => {
			active.value = !active.value;
		};
		const drop = (event) => {
			active.value = false;
			pickOption.value = 1;

			let file = event.dataTransfer.files[0];
			if (!file) return;
			if (!file.type.includes("image")) {
				imgg.value = null;
				return;
			}

			context.emit("setImage", file);

			imgg.value = URL.createObjectURL(file);
		};

		const imgg = ref(null);

		const resetImage = () => {
			imgg.value = null;
			context.emit("setImage", null);
		};

		const change = (event) => {
			let file = event.target.files[0];

			if (!file) return;
			if (!file.type.includes("image")) {
				imgg.value = null;
				return;
			}

			context.emit("setImage", file);

			imgg.value = URL.createObjectURL(file);
		};

		const colorChange = (event) => {
			context.emit("setColor", props.colorPicked);
		};

		return {
			pickOption,
			colors,
			enambleColoorChange,
			drop,
			active,
			togleDragActive,
			imgg,
			resetImage,
			change,
			colorChange,
		};
	},
};
</script>

<style lang="scss" scoped>
.picker {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;

	.header {
		margin-bottom: 20px;
		width: 100%;
		display: flex;
		justify-content: center;

		.buttons {
			display: flex;
			width: 80%;
			justify-content: space-around;
			border: 1px solid #5916b9;
			border-radius: 8px;
			font-size: 14px;

			& > :first-child {
				border-radius: 8px 0 0 8px;
			}

			& > :last-child {
				border-radius: 0 8px 8px 0;
			}

			> .active {
				background-color: #5916b9;
				color: hsl(0, 0%, 100%);
			}

			> * {
				width: 100%;
				padding: 4px;
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
		border-radius: 9px;
		width: 95%;
		height: 200px;
		padding: 20px;
		position: relative;

		&.active {
			background: #e4f8eb 0% 0% no-repeat padding-box;
		}

		> .image {
			display: flex;
			flex-direction: column;
			align-items: center;

			> * {
				margin: 10px 0;
			}

			> img {
				width: 46px;
				height: 46px;
				margin: 0;
			}

			.text {
				color: hsl(230, 43%, 73%);
			}

			> input {
				display: none;
			}

			> .reset-img {
				position: absolute;
				right: 10px;
				top: 10px;

				width: 16px;
				height: 16px;

				cursor: pointer;
			}
		}

		> .color {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 75%;
			justify-content: space-evenly;
			margin-bottom: 20px;

			> span {
				font-size: 18px;
			}

			> .colors-grid {
				width: 100%;
				display: grid;
				column-gap: 12px;
				grid-template-columns: repeat(auto-fit, 30px);
				justify-content: center;
				justify-items: center;
			}

			.col-option {
				appearance: none;
				width: 24px;
				height: 24px;
				background-color: currentColor;
				border-radius: 100%;

				&:checked {
					background-image: url("../assets/icons/check-white.svg");
					background-repeat: no-repeat;
					background-position: center;
					background-size: 65%;

					outline: 5px solid;
					outline-offset: -1px;
					outline-color: currentColor;
				}
			}
		}
	}
}
</style>
