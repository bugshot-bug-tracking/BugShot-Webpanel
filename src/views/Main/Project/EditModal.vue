<template>
	<Modal :show="show" @close="close">
		<div class="wrapper" v-if="project">
			<div class="header">
				<span>Edit Project</span>
			</div>

			<div class="label">Project Name</div>
			<FormInput
				class="my-3"
				:value="projectParams.name"
				@input="(i) => (projectParams.name = i.target.value)"
				:placeholder="`Enter Project Name`"
				:type="'text'"
			/>

			<div class="label">URL</div>
			<FormInput
				class="my-3"
				:value="projectParams.url"
				@input="(i) => (projectParams.url = i.target.value)"
				:placeholder="`Enter Project URL (Optional)`"
				:type="'url'"
			/>

			<Picker
				class="my-2"
				:colorPicked="projectParams.color"
				@setImage="setImage"
				@setColor="setColor"
				:image="projectParams.image"
			/>

			<a
				class="create-button btn bs bf-green"
				@click.prevent="saveChanges"
			>
				Save Changes
			</a>
		</div>
	</Modal>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import Modal from "../../../components/Modal.vue";
import { computed, nextTick, onMounted } from "@vue/runtime-core";
import FormInput from "../../../components/FormInput.vue";
import Picker from "../../../components/Picker.vue";
import store from "../../../store";

export default {
	name: "EditProjectModal",
	props: {
		id: {
			required: true,
			type: String,
		},
	},
	emits: ["close"],
	components: { Modal, FormInput, Picker },
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

		const saveChanges = () => {
			let data = {
				id: props.id,
				designation: projectParams.name,
				url: projectParams.url,
				color_hex: colors[projectParams.color],
				base64: projectParams.image ? btoa(projectParams.image) : null,
			};

			store.dispatch("updateProject", data).then(close);
		};

		return {
			show,
			close,
			project,
			projectParams,
			setImage,
			setColor,
			saveChanges,
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
		margin-right: auto;
		margin-bottom: -20px;
	}
}
</style>
