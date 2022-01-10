<template>
	<Layout>
		<template v-slot:title>General Settings</template>

		<template v-slot:sub-title>
			{{ record?.attributes.designation }}
		</template>

		<div class="settings-table" v-if="record">
			<Column>
				<template v-slot:header> Company Settings </template>

				<div class="body">
					<Container>
						<div class="wrapper">
							<FormInput
								:value="companyParams.name"
								@input="
									(i) => (companyParams.name = i.target.value)
								"
								:placeholder="record.attributes.designation"
								:type="'text'"
							/>
							<!-- change color Picked to the record color -->
							<Picker
								:colorPicked="companyParams.color"
								@setImage="setImage"
								@setColor="setColor"
								:image="companyParams.image"
								v-if="imageFlag"
							/>

							<a
								class="save-button btn bs bf-green"
								@click="saveChanges"
								aria-disabled="true"
							>
								Save changes
							</a>
						</div>
					</Container>
				</div>

				<span>
					Delete company and associated projects \n(can't be reverted)
				</span>
			</Column>

			<Column>
				<template v-slot:header> Team Members </template>

				<div class="body">
					<TeamTable />
				</div>
			</Column>

			<Column>
				<template v-slot:header> Plan Details </template>

				<div class="body">
					<Plan />
				</div>
			</Column>
		</div>
	</Layout>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
import FormInput from "../../../components/FormInput.vue";
import Container from "../../../components/Container.vue";
import Picker from "../../../components/Picker.vue";
import Column from "../Project/BugsTable/Column.vue";
import TeamTable from "../../../components/TeamTable.vue";
import Plan from "../../../components/Plan.vue";
import axios from "axios";

export default {
	components: {
		Layout,
		FormInput,
		Container,
		Picker,
		Column,
		TeamTable,
		Plan,
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
			console.log("setImage", value);
			companyParams.image = await toBase64(value);
		};

		const setColor = (value) => {
			console.log("setImage", value);
			companyParams.color = value;
		};

		const saveChanges = () => {
			console.log(companyParams);
		};

		return {
			record,
			companyParams,
			setImage,
			setColor,
			imageFlag,
			saveChanges,
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

		.save-button {
			margin: 10px;
		}
	}
}
</style>
