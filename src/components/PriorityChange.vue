<template>
	<div
		class="bs-priority"
		:class="['p' + priority, { unlock: !lock }]"
		@click="toggleShow"
		ref="popup"
	>
		{{ priorityText(priority) }}

		<div class="container" v-if="show && !lock">
			<div class="i i1" @click="$emit('change', 1)">
				{{ $t("minor") }}
			</div>

			<div class="i i2" @click="$emit('change', 2)">
				{{ $t("normal") }}
			</div>

			<div class="i i3" @click="$emit('change', 3)">
				{{ $t("important") }}
			</div>

			<div class="i i4" @click="$emit('change', 4)">
				{{ $t("critical") }}
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	priority: {
		type: Number,
		required: true,
	},
	lock: {
		type: Boolean,
		required: false,
		default: true,
		description: "Lock the change event emission",
	},
});

const emit = defineEmits(["change"]);

const popup = ref(null);

const show = ref(false);
const toggleShow = () => {
	if (props.lock) return;
	show.value = !show.value;
};

const close = (e) => {
	if (e.target != popup.value) show.value = false;
};

if (!props.lock) {
	document.addEventListener("click", close);

	onUnmounted(() => {
		document.removeEventListener("click", close);
	});
}

const { t } = useI18n({ useScope: "global" });

const priorityText = (value) => {
	switch (value) {
		case 1:
			return t("minor");
		case 2:
			return t("normal");
		case 3:
			return t("important");
		case 4:
			return t("critical");
	}
};
</script>

<style lang="scss" scoped>
.unlock {
	cursor: pointer;
}

.container {
	display: flex;
	flex-direction: column;

	position: absolute;
	z-index: 1;
	background-color: hsl(240, 40%, 98%);
	top: 200%;
	left: -50%;

	width: 100px;
	align-items: center;
	justify-content: space-evenly;

	border-radius: 8px;
	padding: 0;
	text-align: center;
	color: black;

	box-shadow: 0px 8px 10px hsla(232, 41%, 18%, 0.2);
	border: 1px solid #e6e6ff;
	user-select: none;

	> * {
		border-bottom: 1px solid #e6e6ff;
		width: 100%;
		padding: 8px;
	}

	&::before {
		content: "";
		position: absolute;
		top: -10px;
		z-index: -1;
		width: 20px;
		height: 20px;
		transform: rotate(45deg);

		background-color: hsl(240, 40%, 98%);

		border: 1px solid #e6e6ff;
	}

	.i {
		font-weight: bold;
		background-color: hsl(240, 40%, 98%);

		&:first-child {
			border-radius: 8px 8px 0 0;
		}

		&:last-child {
			border-radius: 0 0 8px 8px;
		}

		&.i4 {
			color: hsl(0, 90%, 60%);

			&:hover {
				background-color: hsl(0, 90%, 60%);
				color: #ffffff;
			}
		}
		&.i3 {
			color: hsl(32, 100%, 67%);

			&:hover {
				background-color: hsl(32, 100%, 67%);
				color: #ffffff;
			}
		}
		&.i2 {
			color: hsl(218, 80%, 47%);

			&:hover {
				background-color: hsl(218, 80%, 47%);
				color: #ffffff;
			}
		}
		&.i1 {
			color: hsl(188, 80%, 47%);

			&:hover {
				background-color: hsl(188, 80%, 47%);
				color: #ffffff;
			}
		}
	}
}
</style>
