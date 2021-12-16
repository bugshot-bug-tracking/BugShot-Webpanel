<template>
	<Layout>
		<template v-slot:title>Projects</template>

		<template v-slot:sub-title>
			{{ record ? record.company.attributes.designation : "loading" }}
		</template>

		<template v-slot:top>
			<InviteModal :dataType="'Company'" :id="id" />

			<CreateDataModal
				:dataType="'Project'"
				:postPath="'project'"
				:aditionalBody="{
					company_id: id,
				}"
				:subTitle="`Company: ${record?.company.attributes.designation}`"
			/>

			<router-link
				:to="{ name: 'CompanySettings', params: { id: id } }"
				class="btn bs be-green"
			>
				Company Settings
			</router-link>
		</template>

		<div v-if="arePojects">
			<GroupContainer :mainText="record.company.attributes.designation">
				<Card
					v-for="project of companyProjects(record.company.id)"
					:key="project.id"
					:title="project.attributes.designation"
					:mainText="'Task Overview'"
					:secondText="
						bugsStats(
							project.attributes.bugsDone,
							project.attributes.bugsTotal
						)
					"
					:color="
						project.attributes.color_hex
							? project.attributes.color_hex
							: '#7A2EE6'
					"
					:image="
						project.attributes.image
							? project.attributes.image
							: null
					"
					:routeTo="{ name: 'Project', params: { id: project.id } }"
				/>
			</GroupContainer>
		</div>
	</Layout>
</template>

<script>
import { computed } from "@vue/reactivity";
import Card from "../../../components/Card.vue";
import GroupContainer from "../../../components/GroupContainer.vue";
import Layout from "../Layout.vue";
import store from "../../../store";
import Search from "../../../components/Search.vue";
import CreateDataModal from "../../../components/CreateDataModal.vue";
import InviteModal from "../../../components/InviteModal.vue";

export default {
	components: {
		Layout,
		GroupContainer,
		Card,
		Search,
		CreateDataModal,
		InviteModal,
	},
	name: "CompanyProjects",
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

		const companyProjects = (company_id) => {
			return store.getters.getCompanyProjects(company_id);
		};

		const arePojects = computed(() => {
			if (!record.value) return false;
			if (!record.value.projects) return false;
			if (!record.value.projects.length > 0) return false;
			return true;
		});

		const bugsStats = (done, total) => {
			let str = "";
			str += done ? done : "0";
			str += " / ";
			str += total ? total : "0";
			return str;
		};

		return {
			record,
			arePojects,
			companyProjects,
			bugsStats,
		};
	},
};
</script>
