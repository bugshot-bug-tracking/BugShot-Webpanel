<template>
	<div @click="modal.open" self-end>
		<slot name="button" v-bind="{ loading: modal.loading }">
			<a class="bs-btn purple" :class="{ loading: modal.loading }">
				<div flex items-center gap-2>
					<img
						src="/src/assets/icons/people.svg"
						alt="peoples"
						class="black-to-white"
						w-5
						h-5
					/>
					{{ $t("edit.company") }}
				</div>
			</a>
		</slot>
	</div>

	<MyModal :modelValue="modal.show" :close="modal.close" z-100>
		<ModalTemplate @close="modal.close">
			<template #header-text>{{ $t("edit.company") }}</template>

			<form class="default-form" @submit.prevent="onSubmit">
				<div class="bs-input my-3">
					<label>{{ $t("company_name") }}</label>

					<input
						v-model="data.name"
						:placeholder="$t('enter_company_name')"
						:type="'text'"
						required
					/>
				</div>

				<Picker
					class="my-2"
					:colorPicked="data.color"
					@setImage="data.setImage"
					@setColor="data.setColor"
					:image="data.image"
				/>

				<button class="bs-btn green mt-3 m-a">
					{{ $t("save_changes") }}
				</button>
			</form>
		</ModalTemplate>
	</MyModal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="
			loadingModal.clear();
			modal.close();
		"
	/>
</template>

<script setup lang="ts">
import toBase64 from "~/util/toBase64";
import colors from "~/util/colors";

const props = defineProps({
	name: {
		required: true,
		type: String,
	},
	color: {
		required: true,
		type: String,
	},
	image: {
		required: false,
		type: String,
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

const data = reactive({
	name: "",
	color: 3,
	image: "",
	url: "",

	set: () => {
		data.name = props.name ?? "";
		data.color = colors.indexOf(props.color) ?? 3;
		data.image = props.image;
	},

	setImage: async (value: File | null) => {
		// console.log("setImage", value);
		if (value != null) data.image = (await toBase64(value)) as string;
		else data.image = "";
	},

	setColor: (value: number) => {
		// console.log("setColor", value);
		data.color = value;
	},
});

data.set();
watch(props, () => {
	data.set();
});

const onSubmit = async () => {
	try {
		loadingModal.show = true;

		await props.submit({
			designation: data.name,
			url: data.url,
			color_hex: colors[data.color],
			base64: data.image ? btoa(data.image) : null,
		});

		loadingModal.state = 1;
		loadingModal.message = t("company_edited_succ");
	} catch (error: any) {
		console.log(error);

		loadingModal.state = 2;
		loadingModal.message = error.response.data.data?.message.replace(":", "");
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
.wrapper {
	width: 20vw;
	min-width: 31rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 3rem;
	gap: 0.5rem;
}

.header {
	width: 95%;
	padding: 0.5rem;
	font-size: 1.25rem;
	border-bottom: 1px solid #eee5fc;
	margin-top: -1.25rem;
	margin-bottom: 1.25rem;
	font-weight: bold;
}

.label {
	font-size: 1rem;
	font-weight: bold;
	padding: 0 0.5rem;
	margin-bottom: -0.5rem;
	text-align: left;
}
</style>
