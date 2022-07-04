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
				<a class="bs-btn red" @click.prevent="execute">
					{{ $t("yes") }}
				</a>

				<a class="bs-btn green empty" @click="close"> {{ $t("no") }}</a>
			</div>
		</div>
	</Modal>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup lang="ts">
const props = defineProps({
	text: {
		required: true,
		type: String,
	},

	callback: {
		required: false,
		type: Function,
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

const execute = async () => {
	if (props.callback)
		try {
			loadingModal.show = true;
			loadingModal.state = 0;
			loadingModal.message = "";

			await props.callback();

			loadingModal.state = 1;
			loadingModal.message = `Project deleted successfully.`;
		} catch (error) {
			console.log(error);
			loadingModal.state = 2;
		} finally {
			setTimeout(() => {
				show.value = false;

				nextTick(() => {
					emit("close");
				});

				loadingModal.show = false;
				loadingModal.state = 0;
				loadingModal.message = "";
			}, 4000);
		}
	else {
		emit("delete");
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25rem;
	height: 12.5rem;
	justify-content: center;
	gap: 1.25rem;
	padding: 1.25rem;

	.actions {
		display: flex;
		align-items: center;
		gap: 2.5rem;
	}

	.text {
		white-space: pre-line;
		margin: unset;
	}
}
</style>
