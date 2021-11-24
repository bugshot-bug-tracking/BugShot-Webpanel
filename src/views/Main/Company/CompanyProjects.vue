<template>
	<Layout>
		<template v-slot:title>Projects</template>

		<template v-slot:sub-title>
			{{ record ? record.company.attributes.designation : "loading" }}
		</template>

		<template v-slot:top>
			<Search />

			<button>Create Project</button>

			<router-link :to="{ name: 'CompanySettings', params: { id: id } }">
				<button>Company Settings</button>
			</router-link>
		</template>

		<h1>Company Projects Page</h1>

		<div v-if="arePojects">
			<GroupContainer :mainText="record.company.attributes.designation">
				<Card
					v-for="project of companyProjects(record.company.id)"
					:key="project.id"
					:title="project.attributes.designation"
					:mainText="'Task Overview'"
					:secondText="'5 / 10'"
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

export default {
	components: { Layout, GroupContainer, Card, Search },
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

		return {
			record,
			arePojects,
			companyProjects,
		};
	},
};
</script>
