<template>
	<a
		class="btn bs text-capitalize"
		:class="{
			'be-green': dataType === 'Company',
			'bf-green': dataType === 'Project',
		}"
		@click="modalActive = !modalActive"
	>
		{{ dataType === "Company" ? $t("add.company") : $t("add.project") }}
	</a>

	<Modal :show="modalActive" @close="modalActive = false">
		<div class="wrapper">
			<div class="header text-capitalize">
				<span>
					{{
						dataType === "Company"
							? $t("add.company")
							: $t("add.project")
					}}
				</span>

				<h4 v-if="subTitle">{{ subTitle }}</h4>
			</div>

			<form
				class="default-form bs-scroll s-purple"
				@submit.prevent="createResource"
			>
				<div class="bs-input my-3 text-capitalize">
					<input
						:type="'text'"
						:placeholder="
							dataType === 'Company'
								? $t('enter_company_name')
								: $t('enter_project_name')
						"
						required
						minlength="1"
						maxlength="255"
						v-model="name"
					/>
				</div>

				<div class="bs-input my-3">
					<input
						v-if="dataType === 'Project'"
						:type="'text'"
						:placeholder="$t('enter_project_url')"
						maxlength="65000"
						v-model="url"
					/>
				</div>

				<Picker
					class="my-2"
					:colorPicked="color"
					@setImage="setImage"
					@setColor="setColor"
				/>

				<AddMemebers @change="setInviteMembers" />

				<button class="btn bs bf-green mt-2 text-capitalize">
					{{
						dataType === "Company"
							? $t("create.company")
							: $t("create.project")
					}}
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

<script>
import { reactive, ref } from "@vue/reactivity";
import Picker from "./Picker.vue";
import axios from "axios";
import Modal from "./Modal.vue";
import store from "../store";
import LoadingModal from "@/components/Modals/LoadingModal.vue";
import toBase64 from "@/util/toBase64";
import AddMemebers from "./AddMemebers.vue";

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
	components: {
		Picker,
		Modal,
		LoadingModal,
		AddMemebers,
	},
	setup(props) {
		const modalActive = ref(false);

		const name = ref("");
		const color = ref(3);
		const file = ref(null);
		const url = ref("");

		const inviteMembers = ref(null);

		const setImage = (value) => {
			// console.log("setImage", value);
			file.value = value;
		};

		const setColor = (value) => {
			// console.log("setImage", value);
			color.value = value;
		};

		const createResource = async () => {
			let resource = {
				name: name.value,
				image: file.value,
				color: color.value,
				members: inviteMembers.value,
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
				loadingModal.show = true;
				loadingModal.state = 0;
				loadingModal.message = null;

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

				let response = await axios.post(props.postPath, {
					designation: resource.name,
					color_hex: colors[resource.color],
					...aditionalBody, // local body extra params
					...props.aditionalBody, // in case aditional body props are necessary from outside
				});

				response = response.data.data;

				let base = "";
				if (response.type === "Company") base = "companies";
				else if (response.type === "Project") base = "projects";

				for (const member of resource.members) {
					try {
						await axios.post(`${base}/${response.id}/invite`, {
							target_email: member.email,
							role_id: member.role,
						});
					} catch (error) {
						console.log(error);
						continue;
					}
				}

				loadingModal.state = 1;

				loadingModal.message = `${props.dataType} created!`;

				store.dispatch("init");

				setTimeout(() => {
					modalActive.value = false;
					loadingModal.show = false;
					name.value = "";
					color.value = 3;
					file.value = null;
					url.value = "";
				}, 4000);
			} catch (error) {
				loadingModal.state = 2;
				loadingModal.message = null;

				console.log(error);

				setTimeout(() => {
					loadingModal.show = false;
					loadingModal.state = 0;
					loadingModal.message = null;
				}, 4000);
			}
		};

		const loadingModal = reactive({
			show: false,
			state: 0,
			message: null,
		});

		const setInviteMembers = (value) => {
			inviteMembers.value = value;
		};

		return {
			modalActive,
			name,
			color,
			file,
			url,
			setImage,
			setColor,
			createResource,
			loadingModal,
			setInviteMembers,
		};
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 20vw;
	min-width: 600px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 25px 50px;

	.header {
		span {
			font-weight: bold;
			font-size: 24px;
		}

		h4 {
			font-size: 16px;
		}
	}
}
.default-form {
	overflow: auto;
	max-height: 85vh;
	margin-right: -32px;
	padding-right: 48px;
}
</style>
