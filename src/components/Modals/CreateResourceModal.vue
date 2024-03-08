<template>
	<div @click.capture="modal.open" v-bind="$attrs">
		<slot name="button" v-bind="{ loading: modal.loading }">
			<n-button
				type="success"
				:ghost="!primary_button"
				round
				size="large"
				:loading="modal.loading"
				:disabled="disabled"
			>
				<template #icon>
					<slot name="button-image">
						<img
							src="/src/assets/icons/add.svg"
							alt="project"
							w-6
							h-6
							:class="{
								'black-to-white': primary_button,
								'black-to-green': !primary_button,
							}"
						/>
					</slot>
				</template>

				<slot name="button-text">
					{{ t("create.create") }}
				</slot>
			</n-button>
		</slot>
	</div>

	<MyModal :modelValue="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close" class="sh-create-resource-modal">
			<template #header-text>
				<slot name="modal-header">
					{{ t("create") }}
				</slot>
			</template>

			<form class="default-form" @submit.prevent="onSubmit">
				<slot name="modal-form"> </slot>

				<n-button
					type="success"
					round
					:loading="modal.loading"
					:disabled="modal.loading"
					m-a
					attr-type="submit"
					class="sh-create-resource-modal-submit"
				>
					<slot name="modal-submit_button">
						{{ t("create") }}
					</slot>
				</n-button>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="modal.close"
	/>
</template>

<script setup lang="ts">
const props = defineProps({
	primary_button: {
		type: Boolean,
		required: false,
		default: false,
	},

	success_message: {
		type: String,
		required: false,
		default: "",
	},

	submit: {
		type: Function,
		required: true,
	},

	preOpenCall: {
		type: Function,
		required: false,
	},

	postOpenCall: {
		type: Function,
		required: false,
	},

	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const emit = defineEmits(["close"]);

const { t } = useI18n();

const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
		if (props.disabled === true) return;

		if (modal.loading === true) return;
		modal.loading = true;
		if (props.preOpenCall) await props.preOpenCall();
		modal.show = true;
		modal.loading = false;
	},
	close: async () => {
		if (modal.loading === true) return;
		modal.loading = true;
		if (props.postOpenCall) await props.postOpenCall();
		modal.show = false;
		modal.loading = false;
		emit("close");
	},
});

const onSubmit = async () => {
	try {
		loadingModal.show = true;

		await props.submit();

		loadingModal.state = 1;
		loadingModal.message = props.success_message;
	} catch (error: any) {
		console.log(error);

		let data = error.response.data;

		loadingModal.state = 2;
		loadingModal.message = data.message;
	}
};

const loadingModal = reactive({
	show: false,
	state: 0,
	message: "",
	clear: () => {
		loadingModal.show = false;
		loadingModal.state = 0;
		loadingModal.message = "";
	},
});
</script>

<style lang="scss" scoped>
.default-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
