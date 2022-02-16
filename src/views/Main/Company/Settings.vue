<template>
	<Layout>
		<template v-slot:title>General Settings</template>

		<template v-slot:sub-title>
			{{ record?.attributes.designation }}
		</template>

		<div class="settings-table" v-if="record">
			<Column class="general">
				<template v-slot:header>
					<div class="bold">Company Settings</div>
				</template>

				<div class="body">
					<Container>
						<form class="wrapper" @submit.prevent="saveChanges">
							<div class="bs-input my-3">
								<input
									v-model="companyParams.name"
									:placeholder="record.attributes.designation"
									:type="'text'"
								/>
							</div>

							<!-- change color Picked to the record color -->
							<Picker
								:colorPicked="companyParams.color"
								@setImage="setImage"
								@setColor="setColor"
								:image="companyParams.image"
								v-if="imageFlag"
							/>

							<button class="btn bs bf-green mt-3">
								Save changes
							</button>
						</form>
					</Container>

					<div v-if="!canEdit" class="disabled-overlay" />
				</div>

				<div class="d-flex flex-column" v-if="canDelete">
					<a class="text-danger" @click.prevent="showDelete = true">
						Delete company and associated projects
					</a>
					(can't be reverted)
				</div>
			</Column>

			<Column class="members">
				<template v-slot:header>
					<div class="bold">Team Members</div>
				</template>

				<div class="body">
					<TeamTable :company_id="id" />

					<div v-if="!canEdit" class="disabled-overlay" />
				</div>
			</Column>

			<Column class="plan" v-if="false">
				<template v-slot:header>
					<div class="bold">Plan Details</div>
				</template>

				<div class="body">
					<Plan />
				</div>
			</Column>
		</div>
	</Layout>

	<DeleteModal
		v-if="showDelete"
		:text="record.attributes.designation"
		@delete="deleteCompany"
		@close="showDelete = false"
	/>

	<StatusModal
		v-if="process.show"
		:status="process.status"
		:message="process.message"
	/>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
import Container from "../../../components/Container.vue";
import Picker from "../../../components/Picker.vue";
import Column from "../Project/BugsTable/Column.vue";
import TeamTable from "../../../components/TeamTable.vue";
import Plan from "../../../components/Plan.vue";
import axios from "axios";
import DeleteModal from "../../../components/Modals/DeleteModal.vue";
import StatusModal from "../../../components/Modals/StatusModal.vue";

export default {
	components: {
		Layout,
		Container,
		Picker,
		Column,
		TeamTable,
		Plan,
		DeleteModal,
		StatusModal,
	},
	name: "CompanySettings",
	props: {
		id: {
			required: true,
			type: String,
			description: "Company ID",
		},
	},
	setup(props) {
		const companyParams = reactive({
			name: "",
			color: 0,
			image: null,
		});
		const imageFlag = ref(false);

		const user = computed(() => {
			return store.getters.getUser;
		});

		const canEdit = computed(() => {
			if (
				!user.value ||
				!record.value ||
				!record.value.attributes.creator
			)
				return false;

			return user.value.id === record.value.attributes.creator.id;
		});

		const canDelete = computed(() => {
			if (
				!user.value ||
				!record.value ||
				!record.value.attributes.creator
			)
				return false;

			return user.value.id === record.value.attributes.creator.id;
		});

		const record = computed(() => {
			let company = store.getters.getCompanyById(props.id);
			imageFlag.value = false;

			if (company) {
				companyParams.name = company.attributes.designation;

				companyParams.color = company.attributes.color_hex
					? colors.indexOf(company.attributes.color_hex)
					: 3;

				try {
					axios
						.get(`companies/${company.id}/image`)
						.then((response) => {
							if (response.data.data.attributes)
								companyParams.image = atob(
									response.data.data.attributes.base64
								);
							else {
								companyParams.image = null;
							}
							imageFlag.value = true;
						});
				} catch (error) {
					console.log(error);
				}
			}

			return company;
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

		const toBase64 = (file) =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});

		const setImage = async (value) => {
			// console.log("setImage", value);
			if (value != null) companyParams.image = await toBase64(value);
			else companyParams.image = null;
		};

		const setColor = (value) => {
			// console.log("setImage", value);
			companyParams.color = value;
		};

		const saveChanges = async () => {
			let data = {
				company_id: props.id,
				designation: companyParams.name,
				color_hex: colors[companyParams.color],
				base64: companyParams.image ? btoa(companyParams.image) : null,
			};

			try {
				process.show = true;
				process.status = 0;
				process.message = null;

				await store.dispatch("updateCompany", data);

				process.status = 1;
				process.message = `Company edited successfully.`;

				setTimeout(() => {
					process.show = false;
					process.status = 0;
					process.message = null;
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

		const deleteCompany = async () => {
			if (!canDelete.value) return;

			try {
				showDelete.value = false;
				process.show = true;
				process.status = 0;
				process.message = null;

				await store.dispatch("deleteCompany", record.value.id);

				process.status = 1;
				process.message = `Company deleted successfully.`;

				setTimeout(() => {
					process.show = false;
					process.status = 0;
					process.message = null;
				}, 4000);
			} catch (error) {
				process.status = 2;

				setTimeout(() => {
					process.show = false;
					process.status = 0;
				}, 4000);
			}
		};

		const showDelete = ref(false);
		const process = reactive({
			show: false,
			status: 0,
			message: null,
		});

		return {
			record,
			companyParams,
			setImage,
			setColor,
			imageFlag,
			saveChanges,
			deleteCompany,
			canEdit,
			canDelete,
			showDelete,
			process,
		};
	},
};
</script>

<style lang="scss" scoped>
.settings-table {
	width: 100%;
	height: 100%;
	display: flex;
	position: relative;
	padding: 30px;

	.general {
		width: 500px;
		min-width: 500px;

		.body {
			position: relative;
		}
	}

	.members {
		max-width: 40%;

		.body {
			position: relative;
		}
	}

	.plan {
		width: 500px;
		min-width: 500px;
	}

	.column {
		display: flex;
		position: relative;
		flex-direction: column;
		height: 100%;
		padding: 15px;
		width: 100%;
		border-right: 1px solid #ede4fc;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

.bold {
	font-weight: bold;
}

.text-danger {
	cursor: pointer;

	&:hover {
		font-weight: bold;
	}
}
</style>
