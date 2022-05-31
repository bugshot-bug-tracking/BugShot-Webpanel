<template>
	<div v-if="flag" class="wrapper">
		<div class="d-flex gap-1" style="word-break: break-all">
			{{ text }}

			<img
				src="/src/assets/icons/edit.svg"
				alt="edit"
				class="bs-to-gray"
				style="width: 18px"
				@click="flag = false"
			/>
		</div>

		<div class="actions bs-to-gray ms-2" v-if="movable || deletable">
			<img
				src="/src/assets/icons/arrow-left-right.svg"
				alt="order"
				class="handle"
				v-if="movable"
			/>

			<img
				src="/src/assets/icons/round_minus.svg"
				alt="edit"
				@click="emit('delete', id)"
				v-if="deletable"
			/>
		</div>
	</div>

	<div v-else class="wrapper">
		<div class="d-flex h-100">
			<input type="text" v-model="newText" class="w-100" />
		</div>

		<div class="actions bs-to-gray ms-2">
			<img
				src="/src/assets/icons/check.svg"
				alt="save"
				style="width: 18px"
				@click="edit"
			/>

			<img
				src="/src/assets/icons/classic_X.svg"
				alt="cancel"
				@click="cancel"
				style="width: 18px"
			/>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(["edit", "delete"]);
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	movable: {
		type: Boolean,
		required: false,
		default: true,
	},
	deletable: {
		type: Boolean,
		required: false,
		default: true,
	},
});

// flag for changing the operation mode (show or edit)
const flag = ref(true);

// useful to have a separate object so the reset is easier
const newText = ref(props.text);

const edit = () => {
	emit("edit", {
		id: props.id,
		text: newText.value,
	});

	flag.value = true;
};

const cancel = () => {
	flag.value = true;
	newText.value = props.text;
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 40px;
}

.actions {
	display: flex;
	gap: 8px;

	img {
		max-height: 22px;
		max-width: 22px;
	}
}

input {
	border: 1px solid hsl(264, 78%, 77%);
	border-radius: 8px;
	width: 100%;
	padding: 2px 6px;

	&:focus,
	&:focus-visible,
	&:hover {
		border-color: hsl(265, 79%, 41%);
		outline-color: hsl(265, 79%, 41%);
	}
}

img {
	cursor: pointer;
}
</style>
