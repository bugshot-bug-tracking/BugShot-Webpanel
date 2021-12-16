<template>
	<div class="thumbnail-wraper" @click="toggleModal">
		<img class="thumbnail" :src="thumbnail" alt="Screenshots" />
		<div class="enlarge" />
	</div>

	<Modal :show="modal" @close="modal = !modal">
		<img :src="shownImage.image" alt="Screenshots" class="screen" />

		<div
			v-show="showMark"
			class="marker"
			:class="priority"
			:style="` 
			left: calc(${shownImage.mark.x}% - 16px);
			top: calc(${shownImage.mark.y}% - 56px);			
			`"
		/>

		<template v-slot:extra>
			<div class="controls-bottom">
				<div class="controls">
					<div
						class="btn btn-hide-mark"
						@click="showMark = !showMark"
					>
						{{ showMark ? "Hide" : "Show" }} mark
					</div>

					<div class="images-counter" v-if="screenshots.length > 1">
						{{ shownImage.number }} of {{ screenshots.length }}
					</div>
				</div>
			</div>

			<div class="controls-side" v-if="screenshots.length > 1">
				<div class="btn btn-side-arrow arrow-left" @click="previous" />
				<div class="btn btn-side-arrow arrow-right" @click="next" />
			</div>
		</template>
	</Modal>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import Modal from "./Modal.vue";

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
		const showMark = ref(true);
		const counter = ref(0);

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

		const shownImage = computed(() => {
			let img = props.screenshots[counter.value];

			// used for getting the image dimensions from base64 data
			let i = new Image();
			i.src = img.attributes.base64;

			return {
				image: img.attributes.base64,
				number: counter.value + 1,
				// needed the position relative to the original image resolution so it can account for different image distorsions while shown via modal
				mark: {
					x: (img.attributes.position_x / i.width) * 100,
					y: (img.attributes.position_y / i.height) * 100,
				},
			};
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
			shownImage,
			priority,
			showMark,
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
		background-image: url("../assets/icons/expand.svg");
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
			background-image: url("../assets/icons/icn_left_arrow.svg");

			&:hover {
				background-image: url("../assets/icons/icn_left_arrow_hover.svg");
			}
		}

		&.arrow-right {
			background-image: url("../assets/icons/icn_left_arrow.svg");
			transform: rotate(180deg);

			&:hover {
				background-image: url("../assets/icons/icn_left_arrow_hover.svg");
				transform: rotate(180deg);
			}
		}
	}
}

.marker {
	z-index: 9101;
	position: absolute;
	display: block;
	width: 32px;
	height: 56px;
	background-position: center center;
	background-repeat: no-repeat;

	&.critical {
		background-image: url("../assets/marks/mark_crit.svg");
	}

	&.important {
		background-image: url("../assets/marks/mark_imp.svg");
	}

	&.normal {
		background-image: url("../assets/marks/mark_normal.svg");
	}

	&.minor {
		background-image: url("../assets/marks/mark_min.svg");
	}
}

.screen {
	overflow: auto;
}
</style>
