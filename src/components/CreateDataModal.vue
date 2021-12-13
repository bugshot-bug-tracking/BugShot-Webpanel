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
				:value="name"
				@input="(i) => (name = i.target.value)"
				:placeholder="`Enter ${dataType} Name`"
				:type="'text'"
			/>

			<FormInput
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
				@input="(i) => (color = parseInt(i.target.value))"
			/>

			<a class="create-button btn bs bf-green" @click="createResource">
				Create {{ dataType }}
			</a>
		</div>
	</Modal>
</template>

<script>
import { ref } from "@vue/reactivity";
import FormInput from "./FormInput.vue";
import Picker from "./Picker.vue";
import axios from "axios";
import Modal from "./Modal.vue";
import store from "../store";

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
	components: { FormInput, Picker, Modal },
	setup(props) {
		const modalActive = ref(false);

		const name = ref("");
		const color = ref(3);
		const file = ref(null);
		const url = ref("");

		const setImage = (value) => {
			console.log("setImage", value);
			file.value = value;
		};

		const createResource = async () => {
			let resource = {
				name: name.value,
				image: file.value,
				color: color.value,
			};
			// console.log("resource", { ...resource, ...props.aditionalBody });

			try {
				if (props.dataType === "Project" && url.value != null) {
					let u = new URL(url.value);
					props.aditionalBody["url"] = u.origin;
				}

				await axios.post(props.postPath, {
					designation: resource.name,
					...props.aditionalBody, // in case aditional body props are necessary from outside
				});

				modalActive.value = false;

				store.dispatch("init");
			} catch (error) {
				console.log(error);
			}
		};
		return {
			modalActive,
			name,
			color,
			file,
			url,
			setImage,
			createResource,
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
			font-size: 32px;
		}
	}
}

.create-button {
	margin: 28px;
	place-self: center;
}
</style>
