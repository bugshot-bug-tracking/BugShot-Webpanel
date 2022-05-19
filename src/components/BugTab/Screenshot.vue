<template>
	<div class="thumbnail-wraper" @click="toggleModal">
		<img class="thumbnail" :src="thumbnail" alt="Screenshots" />
		<div class="enlarge" />
	</div>

	<Modal :show="modal" @close="modal = !modal">
		<img
			:src="showImage"
			alt="Screenshots"
			class="screen"
			ref="bigScreen"
		/>

		<div
			v-show="mark.show"
			class="marker"
			:class="priority"
			:style="{
				left: mark.x + '%',
				top: mark.y + '%',
			}"
		/>

		<template v-slot:extra>
			<div class="controls-bottom">
				<div class="controls">
					<div
						class="btn btn-hide-mark"
						@click="mark.show = !mark.show"
					>
						{{ mark.show ? $t("hide_mark") : $t("show_mark") }}
					</div>

					<div class="images-counter" v-if="screenshots.length > 1">
						{{
							$t("member_out_of", {
								x: counter + 1,
								n: screenshots.length,
							})
						}}
					</div>
				</div>
			</div>

			<div class="controls-side" v-if="screenshots.length > 1">
				<div
					class="btn btn-side-arrow arrow-left"
					v-if="counter > 0"
					@click="previous"
				/>
				<div v-else />

				<div
					class="btn btn-side-arrow arrow-right"
					v-if="counter < screenshots.length - 1"
					@click="next"
				/>
			</div>
		</template>
	</Modal>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import Modal from "../Modal.vue";
import { nextTick } from "@vue/runtime-core";

export default {
	components: { Modal },
	name: "Screenshot",
	props: {
		screenshots: {
			required: true,
			type: Array,
		},
		priority: {
			required: true,
			type: Number,
		},
	},
	emits: ["loading"],
	setup(props, context) {
		const modal = ref(false);
		const counter = ref(0);
		const bigScreen = ref(null);
		const mark = reactive({
			show: true,
			x: 0,
			y: 0,
		});

		// fixes the problem of renedering a null object
		const toggleModal = () => {
			if (props.screenshots[0] == null) {
				modal.value = false;
				return;
			}
			modal.value = !modal.value;
		};

		const previous = () => {
			if (counter.value > 0) counter.value--;
		};

		const next = () => {
			if (counter.value < props.screenshots.length - 1) counter.value++;
		};

		let thumbnail = computed(() => {
			if (props.screenshots.length > 0)
				return props.screenshots[0].attributes.base64;
			return "/";
		});

		const showImage = computed(() => {
			if (counter.value >= props.screenshots.length) counter.value = 0;

			let img = props.screenshots[counter.value];

			// wait untill rendered to get image sizes
			nextTick(() => {
				// get points relative to the original image to put the marker

				mark.x =
					img.attributes.position_x <= 0 &&
					bigScreen.value.naturalWidth <= 0
						? 0
						: (img.attributes.position_x /
								bigScreen.value.naturalWidth) *
						  100;

				mark.y =
					img.attributes.position_y <= 0 &&
					bigScreen.value.naturalHeight <= 0
						? 0
						: (img.attributes.position_y /
								bigScreen.value.naturalHeight) *
						  100;
			});

			return img.attributes.base64;
		});

		const priority = computed(() => {
			switch (props.priority) {
				case 1:
					return "minor";
				case 2:
					return "normal";
				case 3:
					return "important";
				case 4:
					return "critical";

				default:
					return "normal";
			}
		});

		return {
			modal,
			thumbnail,
			counter,
			bigScreen,
			mark,
			showImage,
			priority,
			previous,
			next,
			toggleModal,
		};
	},
};
</script>

<style lang="scss" scoped>
.thumbnail-wraper {
	cursor: pointer;

	.thumbnail {
		width: 100%;
	}

	.enlarge {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		background-image: url("@/assets/icons/expand.svg");
		background-repeat: no-repeat;
		background-position: center;
		background-color: hsla(0, 0%, 0%, 0.15);
		background-size: 10%;

		opacity: 0;
		transition: 0.2s ease-in-out;
	}

	&:hover {
		.enlarge {
			transition: 0.2s ease-in-out;
			opacity: 1;
		}
	}
}

.controls-bottom {
	bottom: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	position: absolute;
	padding: 12px;
	z-index: 1;

	.controls {
		padding: 1vh 0.5vw;
		background-color: hsl(0, 0%, 100%);
		border-radius: 10px;
		box-shadow: 0 3px 6px rgb(0 0 0 / 10%);
		display: inline-flex;
		align-items: center;

		> * {
			margin: 0 10px;
		}

		> .btn-hide-mark {
			border: 2px solid hsl(158, 80%, 47%);
			border-radius: 50px;
			background-color: hsl(0, 0%, 100%);
			width: 170px;
			height: 40px;
			color: hsl(158, 80%, 47%);
			font-weight: 500;

			&:hover {
				background-color: hsl(158, 80%, 47%);
				color: hsl(0, 0%, 100%);
				transition: all 0.2s ease;
				cursor: pointer;
			}
		}

		> .images-counter {
			background-color: hsl(0, 0%, 100%);
		}
	}
}

.controls-side {
	bottom: 0;
	left: -20px;
	height: 100%;
	position: absolute;
	width: calc(100% + 40px);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	.btn-side-arrow {
		min-width: 40px;
		min-height: 40px;
		background-repeat: no-repeat;
		background-origin: content-box;
		background-position: center;
		background-color: hsl(0, 0%, 100%);
		border: 2px solid hsl(158, 80%, 47%);
		border-radius: 100%;

		&:hover {
			background-color: hsl(158, 80%, 47%);
			transition: all 0.2s ease;
			cursor: pointer;
		}

		&.arrow-left {
			background-image: url("@/assets/icons/icn_left_arrow.svg");

			&:hover {
				background-image: url("@/assets/icons/icn_left_arrow_hover.svg");
			}
		}

		&.arrow-right {
			background-image: url("@/assets/icons/icn_left_arrow.svg");
			transform: rotate(180deg);

			&:hover {
				background-image: url("@/assets/icons/icn_left_arrow_hover.svg");
				transform: rotate(180deg);
			}
		}
	}
}

.screen {
	width: auto;
	height: auto;
	max-height: 95vh;
	max-width: 95vw;
}

.marker {
	z-index: 9101;
	position: absolute;
	display: block;
	width: 32px;
	height: 56px;
	margin-left: -16px;
	margin-top: -56px;
	background-position: center center;
	background-repeat: no-repeat;

	&.critical {
		background-image: url("@/assets/marks/mark_crit.svg");
	}

	&.important {
		background-image: url("@/assets/marks/mark_imp.svg");
	}

	&.normal {
		background-image: url("@/assets/marks/mark_normal.svg");
	}

	&.minor {
		background-image: url("@/assets/marks/mark_min.svg");
	}
}
</style>
