<template>
	<Modal :show="show" @close="close">
		<div class="wrapper">
			<span class="text">
				<p>{{ $t("want_to_delete") }}</p>
				<p>
					<b> {{ text }}</b> ?
				</p>
			</span>

			<div class="actions">
				<a class="btn bs bf-red" @click.prevent="$emit('delete')">
					{{ $t("yes") }}
				</a>

				<a class="btn bs be-green" @click="close"> {{ $t("no") }}</a>
			</div>
		</div>
	</Modal>
</template>

<script setup>
const props = defineProps({
	text: {
		required: true,
		type: String,
	},
});

const emit = defineEmits(["close", "delete"]);
const show = ref(false);

onMounted(() => {
	show.value = true;
});

const close = () => {
	show.value = false;

	nextTick(() => {
		emit("close");
	});
};
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 400px;
	height: 200px;
	justify-content: center;
	gap: 40px;
	padding: 20px;

	.actions {
		display: flex;
		align-items: center;
		gap: 40px;
	}

	.text {
		white-space: pre-line;
		margin: unset;
	}
}
</style>
