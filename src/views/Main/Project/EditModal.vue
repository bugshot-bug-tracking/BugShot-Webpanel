<template>
	<Modal :show="show" @close="close">
		<div class="wrapper" v-if="project">
			<div class="header">
				<span>{{ $t("edit.project") }}</span>
			</div>

			<form @submit.prevent="saveChanges">
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

	<StatusModal
		v-if="process.show"
		:status="process.status"
		:message="process.message"
	/>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import Modal from "../../../components/Modal.vue";
import { computed, nextTick, onMounted } from "@vue/runtime-core";
import Picker from "../../../components/Picker.vue";
import store from "../../../store";
import StatusModal from "../../../components/Modals/StatusModal.vue";

export default {
	name: "EditProjectModal",
	props: {
		id: {
			required: true,
			type: String,
		},
	},
	emits: ["close"],
	components: {
		Modal,
		Picker,
		StatusModal,
	},
	setup(props, context) {
		const show = ref(false);

		onMounted(() => {
			show.value = true;
		});

		const close = () => {
			show.value = false;

			nextTick(() => {
				context.emit("close");
			});
		};

		const project = computed(() => {
			const project = store.getters.getProjectById(props.id);

			projectParams.name = project.attributes.designation;

			projectParams.color = project.attributes.color_hex
				? colors.indexOf(project.attributes.color_hex)
				: 3;

			projectParams.url = project.attributes.url
				? project.attributes.url
				: "";
			projectParams.image = project.attributes.image?.attributes.base64;

			return project;
		});

		const colors = [
			"#F23838", // red
			"#F66808", // orange
			"#FFB157", // yellow
			"#7A2EE6", // purple <- default [3]
			"#15BE80", // green
			"#1849CF", // blue
			"#89A3EB", // gray
		];

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

		const toBase64 = (file) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});

		const saveChanges = async () => {
			let data = {
				id: props.id,
				designation: projectParams.name,
				url: projectParams.url,
				color_hex: colors[projectParams.color],
				base64: projectParams.image ? btoa(projectParams.image) : null,
			};

			try {
				process.show = true;
				process.status = 0;
				process.message = null;

				await store.dispatch("updateProject", data);

				process.status = 1;
				process.message = `Project edited successfully.`;

				setTimeout(() => {
					process.show = false;
					process.status = 0;
					process.message = null;
					close();
				}, 4000);
			} catch (error) {
				console.log(error);
				process.status = 2;

				setTimeout(() => {
					process.show = false;
					process.status = 0;
				}, 4000);
			}
		};

		const process = reactive({
			show: false,
			status: 0,
			message: null,
		});

		return {
			show,
			close,
			project,
			projectParams,
			setImage,
			setColor,
			saveChanges,
			process,
		};
	},
};
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
