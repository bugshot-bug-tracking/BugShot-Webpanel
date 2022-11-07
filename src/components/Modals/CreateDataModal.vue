<template>
	<a @click="modalActive = !modalActive">
		<slot name="button" v-bind="{ active: modalActive }">
			<div
				flex
				items-center
				gap-2
				class="bs-btn text-capitalize"
				:class="{
					'green empty': dataType === 'Company',
					green: dataType === 'Project',
				}"
			>
				<img
					src="/src/assets/icons/add.svg"
					alt="project"
					w-6
					h-6
					:class="{
						'black-to-green': dataType === 'Company',
						'black-to-white': dataType === 'Project',
					}"
				/>

				{{
					dataType === "Company"
						? $t("add.company")
						: $t("add.project")
				}}
			</div>
		</slot>
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
				class="default-form bs-scroll"
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

				<AddMembers @change="setInviteMembers" />

				<button class="bs-btn green m-a text-capitalize">
					{{
						dataType === "Company"
							? $t("create.company")
							: $t("create.project")
					}}
				</button>
			</form>
		</div>
	</Modal>

	<LoadingModal2
		:show="loadingModal.show"
		:state="loadingModal.state"
		:message="loadingModal.message"
		@close="loadingModal.clear"
	/>
</template>

<script setup>
import axios from "axios";
import { useMainStore } from "~/stores/main";
import toBase64 from "~/util/toBase64";
import colors from "~/util/colors";

const props = defineProps({
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
});

const { t } = useI18n();

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

	// console.log("resource", { ...resource, ...props.aditionalBody });

	let aditionalBody = {};

	try {
		loadingModal.show = true;

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

		if (resource.members)
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

		await useMainStore().init();

		loadingModal.state = 1;
		loadingModal.message = `${props.dataType} created!`;

		modalActive.value = false;
		name.value = "";
		color.value = 3;
		file.value = null;
		url.value = "";
	} catch (error) {
		console.log(error);

		loadingModal.state = 2;

		if (error.response.status === 403)
			loadingModal.message = t("unauthorized");
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

const setInviteMembers = (value) => {
	inviteMembers.value = value;
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
