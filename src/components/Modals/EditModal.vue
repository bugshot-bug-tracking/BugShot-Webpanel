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

				<button class="btn bs bf-green mt-3">
					{{ $t("save_changes") }}
				</button>
			</form>
		</div>
	</Modal>

	<LoadingModal
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.show = false"
	/>
</template>

<script setup>
import { useMainStore } from "src/stores/main";
import toBase64 from "src/util/toBase64";
import colors from "src/util/colors";

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

	projectParams.name = project.attributes.designation;

	projectParams.color = project.attributes.color_hex
		? Object.keys(colors).findIndex(
				(x) => colors[x] === project.attributes.color_hex
		  )
		: 3;

	projectParams.url = project.attributes.url ? project.attributes.url : "";
	projectParams.image = project.attributes.image?.attributes.base64;

	return project;
});

const projectParams = reactive({
	name: "",
	color: 3,
	image: null,
	url: "",
});

const setImage = async (value) => {
	// console.log("setImage", value);
	if (value != null) projectParams.image = await toBase64(value);
	else projectParams.image = null;
};

const setColor = (value) => {
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
		loadingModal.state = 0;
		loadingModal.message = null;

		await store.updateProject(data);

		loadingModal.state = 1;
		loadingModal.message = `Project edited successfully.`;

		setTimeout(() => {
			loadingModal.show = false;
			loadingModal.state = 0;
			loadingModal.message = null;
			close();
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

const loadingModal = reactive({
	show: false,
	state: 0,
	message: null,
});
</script>

<style lang="scss" scoped>
.wrapper {
	width: 20vw;
	min-width: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 50px;
	gap: 10px;

	.header {
		width: 95%;
		padding: 10px;
		font-size: 20px;
		border-bottom: 1px solid #eee5fc;
		margin-top: -20px;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.label {
		font-size: 16px;
		font-weight: bold;
		padding: 0px 3%;
		margin-bottom: -10px;
		text-align: left;
	}
}
</style>
