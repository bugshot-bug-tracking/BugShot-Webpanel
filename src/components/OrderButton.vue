<template>
	<div class="order-button" ref="root">
		<a @click="popupMenu.toggle" :class="{ active: popupMenu.open }">
			<img src="/src/assets/icons/ordering.svg" alt="Order by" />
		</a>

		<section class="popup" v-show="popupMenu.open">
			<header>
				<span>Order {{ name }}</span>
			</header>
			<hr />

			<div class="order-group" v-if="alphabetical">
				<span>Alphabetical</span>

				<div class="options">
					<label>
						<input
							type="radio"
							name="orderby"
							value="0"
							v-model="radio"
						/>

						<span>A-Z</span>
					</label>

					<label>
						<input
							type="radio"
							name="orderby"
							value="1"
							v-model="radio"
						/>

						<span>Z-A</span>
					</label>
				</div>
			</div>

			<div class="order-group" v-if="creation">
				<span>Creation</span>

				<div class="options">
					<label>
						<input
							type="radio"
							name="orderby"
							value="2"
							v-model="radio"
						/>

						<span>Newest first</span>
					</label>

					<label>
						<input
							type="radio"
							name="orderby"
							value="3"
							v-model="radio"
						/>

						<span>Oldest first</span>
					</label>
				</div>
			</div>

			<div class="order-group" v-if="updated">
				<span>Last update</span>

				<div class="options">
					<label>
						<input
							type="radio"
							name="orderby"
							value="4"
							v-model="radio"
						/>

						<span>Ascending</span>
					</label>

					<label>
						<input
							type="radio"
							name="orderby"
							value="5"
							v-model="radio"
						/>

						<span>Descending</span>
					</label>
				</div>
			</div>

			<button class="bs-btn green my-2" @click.prevent="submit">
				Apply ordering
			</button>
		</section>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	name: {
		type: String,
		required: false,
		default: "by",
	},

	selected: {
		type: Number,
		required: false,
		default: 0,
	},

	alphabetical: {
		type: Boolean,
		required: false,
		default: true,
	},

	creation: {
		type: Boolean,
		required: false,
		default: false,
	},

	updated: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["change"]);

const root = ref(null);

/*
	0: A-Z
	1: Z-A
	2: Creation newest
	3: Creation oldest
	4: Last edit ascending
	5: Last edit descending
*/
const radio = ref(props.selected);

const popupMenu = reactive({
	open: false,
	toggle: () => {
		popupMenu.open = !popupMenu.open;
	},
});

const submit = () => {
	emit("change", parseInt("" + radio.value));
	popupMenu.open = false;
};

const autoClose = (event: MouseEvent) => {
	// event.path for chromium but composedPath is the standard method (ex. firefox)
	let path: EventTarget[] = event.composedPath && event.composedPath();

	// if clicking outside of this root close the popup
	if (path.find((element) => element == root.value) == null) {
		popupMenu.open = false;
	}
};

addEventListener("click", autoClose);
onUnmounted(() => {
	document.removeEventListener("click", autoClose);
});
</script>

<style lang="scss" scoped>
.order-button {
	position: relative;
}

a {
	padding: 0.5rem;
	border-radius: 100%;
	transition: 0.3s;
	cursor: pointer;
	user-select: none;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		width: 1.5rem;
		height: 1.5rem;
	}

	&.active,
	&:hover {
		background: hsl(265, 79%, 54%);

		img {
			transition: 0.3s;
			filter: brightness(0) invert(1);
		}
	}
}

.popup {
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 3rem;
	left: -6rem;

	box-shadow: 0 0.25rem 0.5rem hsla(0, 0%, 0%, 0.129);
	border: 1px solid #eee5fc;
	border-radius: 0.5rem;
	background: white;
	z-index: 30;
	width: 16rem;

	min-height: 6rem;

	padding: 1rem;
}

header {
	padding: 0.5rem;
	font-weight: bold;
}

.order-group {
	display: flex;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 1rem 0.5rem;
	gap: 0.5rem;
	border-bottom: 1px solid #eee5fc;

	&:last-of-type {
		border-bottom: unset;
	}

	.options {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		user-select: none;
		gap: 1rem;

		input {
			display: none;

			& + span {
				color: #7a2ee6;
				border: 1px solid #7a2ee6;
				padding: 0.2rem 0.5rem;
				border-radius: 0.25rem;
				font-size: 0.875rem;
			}

			&:checked + span {
				color: white;
				background: hsl(265, 79%, 54%);
			}
		}
	}
}
</style>
