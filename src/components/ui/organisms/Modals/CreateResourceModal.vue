<template>
	<a @click="modal.open">
		<slot name="button" v-bind="{ loading: modal.loading }">
			<button
				flex
				items-center
				gap-2
				class="bs-btn green text-capitalize"
				:class="{ loading: modal.loading }"
			>
				<slot name="button-image">
					<img
						src="/src/assets/icons/add.svg"
						alt="project"
						w-6
						h-6
						class="black-to-white"
					/>
				</slot>

				<slot name="button-text">
					{{ t("create") }}
				</slot>
			</button>
		</slot>
	</a>

	<MyModal v-model="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>
				<slot name="modal-header">
					{{ t("create") }}
				</slot>
			</template>

			<form class="default-form bs-scroll" @submit.prevent="onSubmit">
				<slot name="modal-form"> </slot>

				<button class="bs-btn green m-a text-capitalize" type="submit">
					<slot name="modal-submit_button">
						{{ t("create") }}
					</slot>
				</button>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
	/>
</template>

<script setup lang="ts">
const modal = reactive({
	show: false,
	loading: false,
	open: async () => {
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
	},
});

const props = defineProps({
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
});

const { t } = useI18n();

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
