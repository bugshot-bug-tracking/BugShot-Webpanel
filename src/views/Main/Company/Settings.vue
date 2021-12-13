<template>
	<Layout>
		<template v-slot:title>General Settings</template>

		<template v-slot:sub-title>
			{{ record?.company.attributes.designation }}
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
								:placeholder="
									record.company.attributes.designation
								"
								:type="'text'"
							/>
							<!-- change color Picked to the record color -->
							<Picker
								:colorPicked="companyParams.color"
								@setImage="setImage"
								@input="
									(i) =>
										(companyParams.color = parseInt(
											i.target.value
										))
								"
							/>
						</div>

						<a
							class="save-button btn btn-primary"
							@click="saveChanges"
							aria-disabled="true"
						>
							Save changes
						</a>
					</Container>
				</div>
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
import { computed, reactive } from "@vue/reactivity";
import Layout from "../Layout.vue";
import store from "../../../store";
import FormInput from "../../../components/FormInput.vue";
import Container from "../../../components/Container.vue";
import Picker from "../../../components/Picker.vue";
import Column from "../Project/BugsTable/Column.vue";
import TeamTable from "../../../components/TeamTable.vue";
import Plan from "../../../components/Plan.vue";
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
		},
	},
	setup(props) {
		const record = computed(() => {
			//!!!!!!!!!!!!!!!!! !TODO! update after UUID Changes
			return store.getters.getCompanyById(parseInt(props.id));
		});

		const companyParams = reactive({
			name: "",
			color: "",
			image: {},
		});

		const setImage = (value) => {
			console.log("setImage", value);
			companyParams.image = value;
		};

		const saveChanges = () => {};

		return {
			record,
			companyParams,
			setImage,
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
}
</style>
