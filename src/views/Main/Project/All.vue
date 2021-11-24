<template>
	<Layout>
		<template v-slot:title>All Projects</template>

		<template v-slot:top>
			<Search />
		</template>

		<GroupContainer
			v-for="item of companies"
			:key="'c' + item.company.id"
			:mainText="item.company.attributes.designation"
		>
			<Card
				v-for="project of companyProjects(item.company.id)"
				:key="'p' + project.id"
				:title="project.attributes.designation"
				:mainText="'Task Overview'"
				:secondText="'5 / 10'"
				:routeTo="{ name: 'Project', params: { id: project.id } }"
			/>
		</GroupContainer>
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
	components: {
		Layout,
		GroupContainer,
		Card,
		Search,
	},
	name: "AllProjects",
	setup() {
		const companies = computed(() => {
			return store.getters.getCompanyWithProjects;
		});

		const companyProjects = (company_id) => {
			return store.getters.getCompanyProjects(company_id);
		};

		return {
			companies,
			companyProjects,
		};
	},
};
</script>
