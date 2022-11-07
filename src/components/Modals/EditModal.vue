<!-- Delete this file and replace instances of this with ProjectEditModal component in the future -->
<template>
	<Modal :show="show" @close="close">
		<div class="wrapper" v-if="project">
			<div class="header">
				<span>{{ $t("edit.project") }}</span>
			</div>

			<form class="default-form" @submit.prevent="saveChanges">
				<div class="label">{{ $t("project_name") }}</div>

				<div class="bs-input my-3">
					<input
						v-model="projectParams.name"
						:placeholder="$t('enter_project_name')"
						:type="'text'"
						required
					/>
				</div>

				<div class="label">URL</div>

				<div class="bs-input my-3">
					<input
						v-model="projectParams.url"
						:placeholder="$t('enter_project_url')"
						:type="'url'"
					/>
				</div>

				<Picker
					class="my-2"
					:colorPicked="projectParams.color"
					@setImage="setImage"
					@setColor="setColor"
					:image="projectParams.image"
				/>

				<button class="bs-btn green mt-3 m-a">
					{{ $t("save_changes") }}
				</button>
			</form>
		</div>
	</Modal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
		@onSuccess="close"
	/>
</template>

<script setup lang="ts">
import { useMainStore } from "~/stores/main";
import toBase64 from "~/util/toBase64";
import colors from "~/util/colors";

const props = defineProps({
	id: {
		required: true,
		type: String,
	},
});

const emit = defineEmits(["close"]);

const store = useMainStore();

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

const project = computed(() => {
	const project = store.getProjectById(props.id);

	if (project) {
		projectParams.name = project.attributes.designation;

		projectParams.color = project.attributes.color_hex
			? colors.findIndex((x) => x === project.attributes.color_hex)
			: 3;

		projectParams.url = project.attributes.url
			? project.attributes.url
			: "";

		projectParams.image = project.attributes.image?.attributes.base64 || "";
	}

	return project;
});

const projectParams = reactive({
	name: "",
	color: 3,
	image: "",
	url: "",
});

const setImage = async (value: File | null) => {
	// console.log("setImage", value);
	if (value != null) projectParams.image = (await toBase64(value)) as string;
	else projectParams.image = "";
};

const setColor = (value: number) => {
	// console.log("setImage", value);
	projectParams.color = value;
};

const saveChanges = async () => {
	let data = {
		id: props.id,
		designation: projectParams.name,
		url: projectParams.url,
		color_hex: colors[projectParams.color],
		base64: projectParams.image ? btoa(projectParams.image) : null,
	};

	try {
		loadingModal.show = true;

		await store.updateProject(data);

		loadingModal.state = 1;
		loadingModal.message = `Project edited successfully.`;
	} catch (error) {
		console.log(error);
		loadingModal.state = 2;
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
}
</style>
