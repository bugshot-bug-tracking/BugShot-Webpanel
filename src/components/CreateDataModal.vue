<template>
	<a
		class="btn bs"
		:class="{
			'be-green': dataType === 'Company',
			'bf-green': dataType === 'Project',
		}"
		@click="modalActive = !modalActive"
	>
		Add {{ dataType }}
	</a>

	<Modal :show="modalActive" @close="modalActive = false">
		<div class="wrapper">
			<div class="header">
				<span>Add {{ dataType }}</span>

				<h4 v-if="subTitle">{{ subTitle }}</h4>
			</div>

			<FormInput
				class="my-3"
				:value="name"
				@input="(i) => (name = i.target.value)"
				:placeholder="`Enter ${dataType} Name`"
				:type="'text'"
			/>

			<FormInput
				class="my-3"
				v-if="dataType === 'Project'"
				:value="url"
				@input="(i) => (url = i.target.value)"
				:placeholder="`Enter ${dataType} URL (Optional)`"
				:type="'url'"
			/>

			<Picker
				class="my-2"
				:colorPicked="color"
				@setImage="setImage"
				@setColor="setColor"
			/>

			<a class="create-button btn bs bf-green" @click="createResource">
				Create {{ dataType }}
			</a>
		</div>
	</Modal>

	<StatusModal
		:status="stage"
		v-if="process"
		@close="process = false"
		:message="message"
	/>
</template>

<script>
import { ref } from "@vue/reactivity";
import FormInput from "./FormInput.vue";
import Picker from "./Picker.vue";
import axios from "axios";
import Modal from "./Modal.vue";
import store from "../store";
import StatusModal from "./Modals/StatusModal.vue";

export default {
	name: "CreateData",
	props: {
		dataType: {
			required: true,
			type: String,
		},
		subTitle: {
			required: false,
			type: String,
		},
		postPath: {
			required: true,
			type: String,
		},
		aditionalBody: {
			required: false,
			type: Object,
		},
	},
	components: { FormInput, Picker, Modal, StatusModal },
	setup(props) {
		const modalActive = ref(false);

		const name = ref("");
		const color = ref(3);
		const file = ref(null);
		const url = ref("");

		const setImage = (value) => {
			// console.log("setImage", value);
			file.value = value;
		};

		const setColor = (value) => {
			// console.log("setImage", value);
			color.value = value;
		};

		const toBase64 = (file) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});

		const createResource = async () => {
			let resource = {
				name: name.value,
				image: file.value,
				color: color.value,
			};

			const colors = [
				"#F23838", // red
				"#F66808", // orange
				"#FFB157", // yellow
				"#7A2EE6", // purple <- default [3]
				"#15BE80", // green
				"#1849CF", // blue
				"#89A3EB", // gray
			];

			// console.log("resource", { ...resource, ...props.aditionalBody });

			let aditionalBody = {};

			try {
				process.value = true;
				stage.value = 0;
				message.value = null;

				if (
					props.dataType === "Project" &&
					url.value != null &&
					url.value != ""
				) {
					// console.log(url.value);

					//! TODO WIP needs a better URL validation strategy
					try {
					let u = new URL(url.value);
					aditionalBody["url"] = u.origin;
					} catch (error) {
						console.log(error);
						aditionalBody["url"] = url.value;
					}
				}

				if (resource.image != null && resource.image instanceof File) {
					let base64 = btoa(await toBase64(resource.image));
					aditionalBody["base64"] = base64;
				}

				await axios.post(props.postPath, {
					designation: resource.name,
					color_hex: colors[resource.color],
					...aditionalBody, // local body extra params
					...props.aditionalBody, // in case aditional body props are necessary from outside
				});

				stage.value = 1;

				message.value = `${props.dataType} created!`;

				store.dispatch("init");

				setTimeout(() => {
					modalActive.value = false;
					process.value = false;
					name.value = "";
					color.value = 3;
					file.value = null;
					url.value = "";
				}, 4000);
			} catch (error) {
				stage.value = 2;
				message.value = null;

				console.log(error);

				setTimeout(() => {
					process.value = false;
					stage.value = 0;
					message.value = null;
				}, 4000);
			}
		};

		const process = ref(false);
		const stage = ref(0);
		const message = ref(null);

		return {
			modalActive,
			name,
			color,
			file,
			url,
			setImage,
			setColor,
			createResource,
			process,
			stage,
			message,
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

	.header {
		span {
			font-weight: bold;
			font-size: 30px;
		}

		h4 {
			font-size: 16px;
		}
	}
}

.create-button {
	margin-top: 10px;
	place-self: center;
}
</style>
