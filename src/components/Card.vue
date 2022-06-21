<template>
	<div class="wrapper">
		<router-link
			:to="routeTo"
			class="top"
			:style="{
				'background-color': color,
			}"
		>
			<img
				v-if="image"
				:src="image.attributes.base64"
				class="dark-overlay"
				alt="image"
			/>
			<div class="text">{{ title }}</div>
			<div class="edit-time">
				{{ $t("last_edit_ago", { time: passedTime }) }}
			</div>
		</router-link>

		<div class="bottom">
			<div class="left">
				<div class="text-left">{{ mainText }}</div>
				<div class="text-right">{{ secondText }}</div>
			</div>

			<div class="right">
				<img
					class="btn"
					src="/src/assets/icons/settings_dots.svg"
					ref="actions"
					@click="toggleShowActions"
				/>

				<div class="pop-actions" v-if="showActions">
					<div class="actions">
						<a class="edit" @click="showModal = 1">
							<img src="/src/assets/icons/edit.svg" alt="edit" />
							<div>{{ $t("edit.edit") }}</div>
						</a>

						<a class="delete" @click="showModal = 2">
							<img
								src="/src/assets/icons/trash.svg"
								alt="delete"
							/>
							<div>{{ $t("delete.delete") }}</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<EditModal v-if="showModal === 1" :id="id" @close="showModal = 0" />

	<DeleteModal
		v-if="showModal === 2"
		:text="title"
		@delete="deleteProject"
		@close="showModal = 0"
	/>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import { useMainStore } from "~/stores/main";
import timeToText from "~/util/timeToText";

const props = defineProps({
	id: {
		required: true,
		type: String,
	},

	title: {
		required: true,
		type: String,
		default: "Title",
	},

	image: {
		type: Object,
	},

	color: {
		type: String,
		default: "#7A2EE6",
	},

	mainText: {
		required: true,
		type: String,
		default: "Group",
	},

	secondText: {
		type: String,
		default: "Group",
	},

	lastEdit: {
		type: String,
		default: null,
	},

	routeTo: {
		required: true,
		type: Object,
	},
});

const store = useMainStore();

const imageURL = computed(() => {
	if (props.image == null) return;
	// console.log(props.image);
	let l = URL.createObjectURL(new Blob([props.image.attributes.base64]));
	// console.log(l);
	return props.image.attributes.base64;
});

const actions = ref(null);
const showActions = ref(false);

const toggleShowActions = () => {
	showActions.value = !showActions.value;
};
const close = (e) => {
	if (e.target != actions.value) showActions.value = false;
};

document.addEventListener("click", close);

onUnmounted(() => {
	document.removeEventListener("click", close);
});

// 0=no modal, 1=edit modal, 2=delete modal
const showModal = ref(0);

const deleteProject = async () => {
	try {
		loadingModal.show = true;
		loadingModal.state = 0;
		loadingModal.message = null;

		await store.deleteProject(props.id);

		loadingModal.state = 1;
		loadingModal.message = `Project deleted successfully.`;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
		}, 4000);
	} catch (error) {
		console.log(error);
		loadingModal.state = 2;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
		}, 4000);
	}
};

const passedTime = computed(() => {
	return timeToText(props.lastEdit);
});

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	margin: 10px;
	width: 320px;
	height: 200px;
	border-radius: 12px;
	box-shadow: 0px 2px 4px hsla(0, 0%, 0%, 0.161);

	> .top {
		border-radius: 12px 12px 0 0;
		height: 145px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;

		> img {
			min-width: 100%;
			min-height: 100%;
		}

		> .text {
			position: absolute;
			font-size: 20px;
			font-weight: bold;
			color: hsl(0, 0%, 100%);
			left: 1rem;
			bottom: 2rem;
			text-align: left;
		}

		> .edit-time {
			position: absolute;
			font-size: 14px;
			color: white;
			left: 1rem;
			bottom: 0.5rem;
			text-align: left;
		}
	}

	> .bottom {
		display: flex;
		position: relative;
		height: 55px;
		align-items: center;

		.left {
			display: flex;
			justify-content: space-between;
			width: 99%;
			width: 89%;
			border-right: 1px solid hsl(263, 79%, 94%);
			padding: 10px 10px;
			font-weight: bold;
			text-transform: capitalize;
		}

		.right {
			display: flex;
			height: 100%;
			position: relative;

			img {
				width: 50px;
			}

			.pop-actions {
				position: absolute;
				display: flex;
				flex-direction: column;
				background-color: #f8f8fc;
				border: 1px solid #e6e6ff;
				top: auto;
				left: 42px;
				z-index: 1;
				font-size: 16px;
				align-items: flex-start;
				justify-content: center;
				border-radius: 6px;
				box-shadow: 0px 3px 6px #00000029;

				&::before {
					content: "";
					position: absolute;
					top: 5px;
					left: -7px;
					z-index: -1;
					width: 20px;
					height: 20px;
					transform: rotate(45deg);
					background-color: #f8f8fc;
					border: 1px solid #e6e6ff;
					box-shadow: 5px 1px 6px #00000029;
				}

				.actions {
					padding: 4px 0;
					background-color: #f8f8fc;
					border-radius: 6px;
					text-transform: capitalize;
				}

				a {
					text-decoration: none;
					display: flex;
					align-items: center;
					background-color: #f8f8fc;
					width: 100%;
					gap: 4px;
					padding: 4px 16px;
					color: black;
					user-select: none;
					cursor: pointer;

					> img {
						height: 24px;
						width: 24px;
					}

					&:hover {
						background-color: hsl(158, 79%, 87%);
					}

					&.delete {
						margin-top: 8px;
						> img {
							height: 20px;
						}
					}
				}
			}
		}
	}

	.dark-overlay {
		filter: brightness(0.8);
	}
}
</style>
